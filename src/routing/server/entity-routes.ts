import { Request, Response, RequestHandler, NextFunction } from 'express-serve-static-core'
import * as mongoose from 'mongoose'
import { Model, Document } from 'mongoose'
import { kebabCase, camelCase } from 'lodash'
import * as tv4 from 'tv4'
import { serverError, userError, notFoundError, NotFoundError, jsonError } from './json-errors'
import * as multer from 'multer'
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

const { from: entityFromSchema } = SchemaMapper( { omitDefault: false } )

const jsonParser = bodyParser.json()

const storage = multer.diskStorage( {
  destination: ( req, file, cb ) => {
    const { mimetype } = file
    const { title, Model } = req[ '_wsMetadata' ]

    const model = req[ '_wsMetadata' ].model || Model()

    req[ '_wsMetadata' ].model = model

    const rootDirectory = mimetype.startsWith( 'image' ) ? 'img' : 'files'
    const entityPath = `public/${ rootDirectory }/${ kebabCase( title ) }`
    const modelPath = `${ entityPath }/${ model.id }`

    ensureDirectories( entityPath, modelPath )

    cb( null, modelPath )
  },
  filename: ( req, file, cb ) => {
    const parsed = path.parse( file.originalname )
    const filename = kebabCase( file.fieldname ) + parsed.ext
    cb( null, filename )
  }
} )

const upload = multer( { storage } )

/*
  when you check that a property value is unique within a collection, you don't
  want it to fail because the existing entity has that property, so remove self
  from the collection before checking
*/
const excludeOwnProperties = ( model: {}, uniqueValuesMap: {} ) => {
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
const selectBodyParser = ( req: Request, res: Response, next: NextFunction ) => {
  if( req.headers[ 'content-type' ]!.startsWith( 'application/json' ) ) {
    jsonParser( req, res, next )

    return
  }

  // add a check here that it's form multipart

  const { body } = req

  const pointerPaths = Object.keys( body ).filter( key => key.startsWith( '/' ) )

  const flatModel = pointerPaths.reduce( ( obj, pointer ) => {
    obj[ pointer ] = JSON.parse( body[ pointer ] )
    return obj
  }, {} )

  pointerPaths.forEach( pointer => delete body[ pointer ] )

  const model = expand( flatModel )

  Object.assign( body, model )

  next()
}

const addMetaData = ( metadata: any ) => ( req: Request, res: Response, next: NextFunction ) => {
  Object.assign( req, { _wsMetadata: metadata } )
  next()
}

export const EntityRoutes = ( schemaCollection: IAppSchema[] ): IRouteData => {
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

    const addFiles = ( req: Request, uploadablePropertyNames: string[] ) => {
      if ( uploadablePropertyNames.length ) {
        const { body } = req
        const files = <Express.Multer.File[]>req.files

        if( !files ) return

        uploadablePropertyNames.forEach( propertyName => {
          const file = files.find( f => f.fieldname === '/' + propertyName )

          if ( file ) {
            const urlPath = path.relative( 'public', file.path ).split( path.sep ).join( path.posix.sep )

            body[ propertyName ] = urlPath
          }
        } )
      }
    }

    const postHandler = async ( req: Request, res: Response ) => {
      let { body } = req

      try {
        const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.create ] )

        if ( !userSchemas.titles.includes( title ) ) {
          notFoundError( res, Error( `${ routePath } not found` ) )

          return
        }

        const uploadablePropertyNames = userSchemas.uploadablePropertyNames( title )
        const parentProperty = userSchemas.parentProperty( title )

        addFiles( req, uploadablePropertyNames )

        const parentId = getParentId( body, parentProperty )
        const uniqueValuesMap = await ( <any> Model ).uniqueValuesMap( parentId )
        const entitySchema = <IEntitySchema>userSchemas.normalize( title )
        const schema = addUniques( entitySchema, uniqueValuesMap )

        const systemSchema = <IEntitySchema>schemas.normalize( title )
        const defaultValues = entityFromSchema( systemSchema )

        body = deepAssign( {}, defaultValues, body )

        const validate = tv4.validateMultiple( body, <tv4.JsonSchema>schema )

        if ( validate.valid ) {
          let model

          if ( req[ '_wsMetadata' ].model ) {
            model = req[ '_wsMetadata' ].model
            Object.assign( model, body )
          } else {
            model = <any>new Model( body )
          }

          const product = await ( <any>model ).save()
          const filtered = filterEntityBySchema( product.toJSON(), schema )

          filtered._id = product._id

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

    const fileHandlers = ( finalHandler: RequestHandler, accesses: EntityAccess[] ) => [
      addMetaData( {
        title, Model
      } ),
      ( req, res, next ) => uploadIfHasFile( req, res, next, accesses ),
      selectBodyParser,
      finalHandler
    ]

    const postHandlers = fileHandlers( postHandler, [ EntityAccesses.create ] )

    const putHandler = async ( req: Request, res: Response ) => {
      const id: string = req.params.id

      try {
        const userSchemas = getUserSchemas( req, schemaCollection, [ EntityAccesses.update ] )

        if ( !userSchemas.titles.includes( title ) ) {
          notFoundError( res, Error( `${ routePath } not found` ) )

          return
        }

        const doc = await Model.findById( id )

        if ( doc === null )
          throw new NotFoundError( `No ${ title } found for ID ${ id }` )

        let { body } = req

        const uploadablePropertyNames = userSchemas.uploadablePropertyNames( title )

        addFiles( req, uploadablePropertyNames )

        const parentProperty = userSchemas.parentProperty( title )
        const parentId = getParentId( id, parentProperty )

        let uniqueMap = await ( <any> Model ).uniqueValuesMap( parentId )

        uniqueMap = excludeOwnProperties( doc, uniqueMap )

        const entitySchema = <IEntitySchema>userSchemas.normalize( title )
        const schema = addUniques( entitySchema, uniqueMap )
        const filteredBody = filterEntityBySchema( body, schema )

        Object.assign( doc, filteredBody )

        const docAsJson = doc.toJSON()
        const systemSchema = <IEntitySchema>schemas.normalize( title )
        const filtered = filterEntityBySchema( docAsJson, systemSchema )
        const validate = tv4.validateMultiple( filtered, <tv4.JsonSchema>systemSchema )

        if ( !validate.valid ) {
          res.status( 400 ).json( validate.errors )
          return
        }

        const product = await doc.save()

        const filteredResult = filterEntityBySchema( product.toJSON(), schema )

        filteredResult._id = product._id

        res.status( 201 ).json( filteredResult )
      } catch ( err ) {
        jsonError( res, err )
      }
    }

    const putHandlers = fileHandlers( putHandler, [ EntityAccesses.update ] )

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

            const schema = <IEntitySchema>schemas.normalize( title )
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
            const schema = <IEntitySchema>schemas.normalize( title )
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
            const schema = <IEntitySchema>schemas.normalize( title )

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
            const schema = <IEntitySchema>schemas.normalize( title )

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
