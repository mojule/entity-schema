import { Request, Response, RequestHandler, NextFunction } from 'express-serve-static-core'
import * as mongoose from 'mongoose'
import { Model, Document, MongooseDocument } from 'mongoose'
import { kebabCase, camelCase } from 'lodash'
import * as tv4 from 'tv4'
import { serverError, userError, notFoundError, NotFoundError, jsonError } from './json-errors'
import * as multer from 'multer'
import { DiskStorageOptions } from 'multer'
import * as fs from 'fs'
import * as path from 'path'
import { is } from '@mojule/is'
import * as bodyParser from 'body-parser'
import { expand } from '@mojule/json-pointer'
import { ensureDirectories } from '../../utils/ensure-directories'
import { IEntitySchema } from '../../predicates/entity-schema'
import { IAppSchema } from '../../predicates/app-schema'
import { SchemaCollection } from '../../schema-collection'
import { pascalCase } from '../../utils/pascal-case'
import { IRouteData } from './types'
import { mongooseModels } from '../../mongoose/mongoose-models'
import { addUniques } from '../../add-uniques'
import { filterEntityBySchema } from '../../filter-entity-by-schema'
import { getUserSchemas } from '../../utils/get-user'
import * as SchemaMapper from '@mojule/schema-mapper'
import { PropertyAccesses, EntityAccess, EntityAccesses } from '../../security/types';
import { deepAssign } from '../../utils/deep-assign'
import { ModelResolverMap } from '../../model-resolvers/types';
import { modelResolvers } from '../../model-resolvers';
import { FileResolverMap, fileResolvers } from '../../file-resolvers'
import { EntityStorage } from '../../file-resolvers/entity-storage';
import { getMultipartFields } from '../../utils/get-multipart-values';

const { from: entityFromSchema } = SchemaMapper( { omitDefault: false } )

const jsonParser = bodyParser.json()

/*
  when you check that a property value is unique within a collection, you don't
  want it to fail because the existing entity has that property, so remove self
  from the collection before checking
*/
const excludeOwnProperties = ( model: Document, uniqueValuesMap: {} ) => {
  const map = {}

  Object.keys( uniqueValuesMap ).forEach( propertyName => {
    map[ propertyName ] = uniqueValuesMap[ propertyName ].filter( value => value !== model[ propertyName ] )
  } )

  return map
}

/*
  middleware for deciding how to parse the http body

  if the http body is json, use jsonParse, otherwise parse the req.body as if
  it were a multipart form
*/
const selectBodyParser = async ( req: Request, res: Response, next: NextFunction ) => {
  if( req.headers[ 'content-type' ]!.startsWith( 'application/json' ) ) {
    jsonParser( req, res, next )

    return
  }

  // add a check here that it's form multipart
  const body = await getMultipartFields( req )

  const pointerPaths = Object.keys( body ).filter( key => key.startsWith( '/' ) )

  const flatModel = pointerPaths.reduce( ( obj, pointer ) => {
    obj[ pointer ] = JSON.parse( body[ pointer ] )
    return obj
  }, {} )

  pointerPaths.forEach( pointer => delete body[ pointer ] )

  const model = expand( flatModel )

  req.body = { ...( req.body || {} ), ...body, ...model }

  next()
}

const addMetaData = ( metadata: Metadata ) => ( req: Request, res: Response, next: NextFunction ) => {
  Object.assign( req, { _wsMetadata: metadata } )
  next()
}

const getMetaData = ( req: Request ) => <Metadata>req[ '_wsMetadata' ]

export interface EntityRouteOptions {
  modelResolvers?: ModelResolverMap
  fileResolvers?: FileResolverMap
}

const entityRouteOptions: EntityRouteOptions = {
  modelResolvers,
  fileResolvers
}

export interface Metadata {
  Model: Model<Document>
  model: Document
  title: string
  body: any
  meta: any
}

export const EntityRoutes = ( schemaCollection: IAppSchema[], options: EntityRouteOptions = entityRouteOptions ): IRouteData => {
  if ( options !== entityRouteOptions ) {
    let { modelResolvers, fileResolvers } = entityRouteOptions

    modelResolvers = Object.assign( {}, modelResolvers, options.modelResolvers )
    fileResolvers = Object.assign( {}, fileResolvers, options.fileResolvers )

    options = { modelResolvers, fileResolvers }
  }

  const { modelResolvers, fileResolvers } = options

  if( modelResolvers === undefined || fileResolvers === undefined )
    throw Error( 'Expected modelResolvers and fileResolvers' )

  const storage = EntityStorage( fileResolvers )
  const upload = multer( { storage } )

  const models = mongooseModels<Model<Document>>( schemaCollection )
  const schemas = SchemaCollection( schemaCollection )
  const { entityTitles } = schemas

  const createRouteData = ( title: string, Model: Model<Document> ): IRouteData => {
    const routePath = kebabCase( title )

    const getParentId = ( body: {}, parentProperty?: string ) => {
      if ( parentProperty ) {
        if ( body[ parentProperty ] && body[ parentProperty ].entityId ) {
          return body[ parentProperty ].entityId
        }

        throw Error( `Expected post body to have ${ parentProperty }.entityId` )
      }
    }

    const getFiles = ( req: Request, uploadablePropertyNames: string[] ) => {
      const filePaths = {}

      if ( uploadablePropertyNames.length ) {
        const files = <Express.Multer.File[]>req.files

        if( !files ) return filePaths

        uploadablePropertyNames.forEach( propertyName => {
          const file = files.find( f => f.fieldname === '/' + propertyName )

          if ( file ) {
            const urlPath = path.relative( 'public', file.path ).split( path.sep ).join( path.posix.sep )

            filePaths[ propertyName ] = urlPath
          }
        } )
      }

      return filePaths
    }

    const getSchema = async ( userSchemas, body, doc?: mongoose.Document ) => {
      try {
        const parentProperty = userSchemas.parentProperty( title )
        const parentId = getParentId( body, parentProperty )

        let uniqueValuesMap = await ( <any>Model ).uniqueValuesMap( parentId )

        if ( doc ){
          uniqueValuesMap = excludeOwnProperties( doc, uniqueValuesMap )
        }

        const entitySchema = <IEntitySchema>userSchemas.normalize( title )
        const schema = addUniques( entitySchema, uniqueValuesMap )

        return schema
      } catch ( err ){
        throw err
      }
    }

    const createModelHandler = async ( req: Request, res: Response, next: NextFunction ) => {
      try {
        let { body } = req

        const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.create ] )

        if ( !userSchemas.titles.includes( title ) ) {
          notFoundError( res, Error( `${ routePath } not found` ) )

          return
        }

        const systemSchema = <IEntitySchema>schemas.normalize( title )
        const defaultValues = entityFromSchema( systemSchema )

        // remove empty strings that aren't in required
        Object.keys( defaultValues ).forEach( key => {
          const required = systemSchema.required || []
          if ( !required.includes( key ) && defaultValues[ key ] === '' ){
            delete defaultValues[ key ]
          }
        } )

        const schema = await getSchema( userSchemas, body )

        body = filterEntityBySchema( body, schema )
        body = deepAssign( {}, defaultValues, body )

        let model: any = new Model( body )

        let meta
        if ( modelResolvers && ( title in modelResolvers ) ) {
          const resolved = await modelResolvers[ title ]( EntityAccesses.create, model, body, req, res )
          model = resolved.document
          meta = resolved.meta
        }

        addMetaData({
          Model, model, title, body, meta
        })( req, res, next )
      } catch ( err ) {
        userError( res, err )
      }
    }

    const updateModelHandler = async ( req: Request, res: Response, next: NextFunction ) => {
      try {
        const id: string = req.params.id
        let { body } = req

        const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.create ] )

        if ( !userSchemas.titles.includes( title ) ) {
          notFoundError( res, Error( `${ routePath } not found` ) )

          return
        }

        const systemSchema = <IEntitySchema>schemas.normalize( title )

        let model: Document

        const result = await Model.findById( id )

        if ( result === null )
          throw new NotFoundError( `No ${ title } found for ID ${ id }` )

        model = result

        const schema = await getSchema( userSchemas, body, model )
        const filteredModel = filterEntityBySchema( model.toJSON(), systemSchema )

        body = filterEntityBySchema( body, schema )
        body = deepAssign( {}, filteredModel, body )

        Object.assign( model, body )

        let meta
        if ( modelResolvers && ( title in modelResolvers ) ) {
          const resolved = await modelResolvers[ title ]( EntityAccesses.create, model, body, req, res )
          model = resolved.document
          meta = resolved.meta
        }

        addMetaData( {
          Model, model, title, body, meta
        } )( req, res, next )
      } catch ( err ) {
        userError( res, err )
      }
    }

    const createOrUpdateHandler = async ( req: Request, res: Response ) => {
      try {
        const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.create ] )

        if ( !userSchemas.titles.includes( title ) ) {
          notFoundError( res, Error( `${ routePath } not found` ) )

          return
        }

        const metadata = getMetaData( req )
        const { model, body, meta } = metadata
        const uploadablePropertyNames = userSchemas.uploadablePropertyNames( title )
        const schema = await getSchema( userSchemas, body )
        const filePaths = getFiles( req, uploadablePropertyNames )

        Object.keys( filePaths ).forEach( key => {
          const filePath = filePaths[ key ]
          body[ key ] = filePath
          model[ key ] = filePath
        })

        const validate = tv4.validateMultiple( body, <tv4.JsonSchema>schema )

        if ( validate.valid ) {
          const product = await ( <any>model ).save()
          const filtered = filterEntityBySchema( product.toJSON(), schema )

          filtered._id = product._id

          if( meta )
            filtered._meta = meta

          res.status( 201 ).json( filtered )
        } else {
          res.status( 400 ).json( validate.errors )
        }
      } catch ( err ) {
        userError( res, err )
      }
    }

    const uploadIfHasFile = ( req: Request, res: Response, next: NextFunction, accesses: EntityAccess[] ) => {
      const userSchemas = getUserSchemas( req, schemaCollection, accesses )
      const uploadablePropertyNames = userSchemas.uploadablePropertyNames( title )

      if ( uploadablePropertyNames.length ) {
        upload.any()( req, res, next )
        return
      }

      next()
    }

    const fileHandlers = ( modelHandler: RequestHandler, finalHandler: RequestHandler, accesses: EntityAccess[] ) => [
      selectBodyParser,
      modelHandler,
      ( req, res, next ) => uploadIfHasFile( req, res, next, accesses ),
      finalHandler
    ]

    const postHandlers = fileHandlers( createModelHandler, createOrUpdateHandler, [ EntityAccesses.create ] )
    const putHandlers = fileHandlers( updateModelHandler, createOrUpdateHandler, [ EntityAccesses.update ] )

    return {
      [ routePath ]: {
        // get list of available ids
        get: async ( req: Request, res: Response ) => {
          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const documents = await Model.find( {}, '_id' )
            const result = documents.map( r => r._id )

            res.json( result )
          } catch ( err ) {
            serverError( res, err )
          }
        },
        // create a new entity instance
        post: postHandlers
      },
      [ `${ routePath }/:propertyName/:propertyValue` ]: {
        // get a model by a field guaranteed to be unique
        get: async ( req: Request, res: Response ) => {
          const propertyName: string = req.params.propertyName
          const propertyValue: string = req.params.propertyValue

          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const uniqueValuePropertyNames = userSchemas.uniquePropertyNames( title )

            if ( !uniqueValuePropertyNames.includes( propertyName ) ) {
              const error = Error( `No unique property ${ propertyName } found` )

              userError( res, error )

              return
            }

            const doc = await Model.findOne( { [ propertyName ]: propertyValue } )

            if ( doc === null )
              throw new NotFoundError( `No match found for ${ propertyName } = ${ propertyValue }` )

            res.json( doc.toJSON() )
          } catch ( err ) {
            jsonError( res, err )
          }
        }
      },
      [ `${ routePath }/:id([0-9a-f]{24})` ]: {
        // get an entity by id
        get: async ( req: Request, res: Response ) => {
          const id: string = req.params.id

          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const doc = await Model.findById( id )

            if ( doc === null )
              throw new NotFoundError( `No ${ title } found for ID ${ id }` )

            const schema = <IEntitySchema>userSchemas.normalize( title )
            const filteredResult = filterEntityBySchema( doc.toJSON(), schema )

            filteredResult._id = doc._id

            res.json( filteredResult )
          } catch ( err ) {
            jsonError( res, err )
          }
        },
        // update an existing entity
        put: putHandlers,
        delete: async( req: Request, res: Response ) => {
          const id: string = req.params.id

          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.delete ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const doc = await Model.findById( id )

            if ( doc === null )
              throw new NotFoundError( `No ${ title } found for ID ${ id }` )

            const removed = await doc.remove()
            const schema = <IEntitySchema>userSchemas.normalize( title )
            const filteredResult = filterEntityBySchema( removed.toJSON(), schema )

            filteredResult._id = doc._id

            res.json( filteredResult )
          } catch( err ){
            jsonError( res, err )
          }
        }
      },
      [ `${ routePath }/all` ]: {
        // get all entities
        get: async ( req: Request, res: Response ) => {
          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const docs = await Model.find( {} )
            const schema = <IEntitySchema>userSchemas.normalize( title )

            const filtered = docs.map( doc => {
              const filteredResult = filterEntityBySchema( doc.toJSON(), schema )

              filteredResult._id = doc._id

              return filteredResult
            })

            res.json( filtered )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
      [ `${ routePath }/filter` ]: {
        // get all entities matching params
        get: async ( req: Request, res: Response ) => {
          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const normal: any = {}
            const nested: any = {}

            Object.keys( req.query ).forEach( key => {
              if( key.startsWith( '/' ) ){
                nested[ key ] = req.query[ key ]
              } else {
                normal[ key ] = req.query[ key ]
              }
            })

            const query = Object.assign( {}, normal, expand( nested ) )

            const docs = await Model.find( query )
            const schema = <IEntitySchema>userSchemas.normalize( title )

            const filtered = docs.map( doc => {
              const filteredResult = filterEntityBySchema( doc.toJSON(), schema )

              filteredResult._id = doc._id

              return filteredResult
            } )

            res.json( filtered )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
      [ `${ routePath }/:propertyName` ]: {
        // get all possible values for the unique named property
        get: async ( req: Request, res: Response ) => {
          const propertyName: string = req.params.propertyName

          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const uniqueValuePropertyNames = userSchemas.uniquePropertyNames( title )

            if ( !uniqueValuePropertyNames.includes( propertyName ) ) {
              notFoundError( res, Error( `No unique property ${ propertyName } found` ) )

              return
            }

            const values = await ( <any>Model ).valuesForUniqueProperty( propertyName )

            res.json( values )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
    }
  }

  const rootRoutes: IRouteData = {
    '.': {
      get: ( req: Request, res: Response ) => {
        const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.read ] )
        const { entityTitles } = userSchemas

        res.json( entityTitles.map( kebabCase ) )
      }
    }
  }

  return entityTitles.reduce( ( routeData, title ) => {
    const ctorName = pascalCase( title )
    const Model = models[ ctorName ]
    const currentRouteData = createRouteData( title, Model )

    Object.assign( routeData, currentRouteData )

    return routeData
  }, rootRoutes )
}
