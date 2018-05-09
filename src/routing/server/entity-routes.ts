import { Request, Response, RequestHandler, NextFunction } from 'express-serve-static-core'
import * as mongoose from 'mongoose'
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

const appSchemaPath = './app-schema'

const excludeOwnProperties = ( model: {}, uniqueValuesMap: {} ) => {
  const map = {}

  Object.keys( uniqueValuesMap ).forEach( propertyName => {
    map[ propertyName ] = uniqueValuesMap[ propertyName ].filter( value => value !== model[ propertyName ] )
  } )

  return map
}

const selectBodyParser = ( schema: IEntitySchema ) => ( req: Request, res: Response, next: NextFunction ) => {
  if( req.headers[ 'content-type' ]!.startsWith( 'application/json' ) ) {
    jsonParser( req, res, next )

    return
  }

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

export const EntityRoutes = ( schemaMap: IAppSchema[] ): IRouteData => {
  const createRouteData = ( title: string, uniqueValuePropertyNames: string[], Model ): IRouteData => {
    const uploadablePropertyNames = schemas.uploadablePropertyNames( title )
    const hasUploadableProperties = !!uploadablePropertyNames.length
    const entitySchema = <IEntitySchema>schemas.normalize( title )
    const parentProperty = schemas.parentProperty( title )

    const routeName = kebabCase( title )

    const getParentId = async ( body: {} ) => {
      if ( parentProperty ) {
        if ( body[ parentProperty ] && body[ parentProperty ].entityId ) {
          return body[ parentProperty ].entityId
        }

        throw Error( `Expected post body to have ${ parentProperty }.entityId` )
      }
    }

    const addFiles = ( req: Request ) => {
      if ( hasUploadableProperties ) {
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
      const { body } = req

      try {
        addFiles( req )

        const parentId = await getParentId( body )
        const uniqueValuesMap = await Model.uniqueValuesMap( parentId )
        const schema = addUniques( entitySchema, uniqueValuesMap )
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

          res.status( 201 ).json( product.toJSON() )
        } else {
          res.status( 400 ).json( validate.errors )
        }
      } catch ( err ) {
        userError( res, err )
      }
    }

    const uploadIfHasFile = ( req: Request, res: Response, next: NextFunction ) => {
      if ( hasUploadableProperties ) {
        upload.any()( req, res, next )
        return
      }

      next()
    }

    const fileHandlers = ( finalHandler: RequestHandler ) => [
      addMetaData( {
        title, Model
      } ),
      uploadIfHasFile,
      selectBodyParser( entitySchema ),
      finalHandler
    ]

    const postHandlers = fileHandlers( postHandler )

    const putHandler = async ( req: Request, res: Response ) => {
      const id: string = req.params.id

      try {
        const doc = await Model.findById( id )

        if ( doc === null )
          throw new NotFoundError( `No ${ title } found for ID ${ id }` )

        let { body } = req

        addFiles( req )

        const parentId = await getParentId( id )

        let uniqueMap = await Model.uniqueValuesMap( parentId )

        uniqueMap = excludeOwnProperties( doc, uniqueMap )

        const schema = addUniques( entitySchema, uniqueMap )
        const filteredBody = filterEntityBySchema( body, schema )

        Object.assign( doc, filteredBody )

        const docAsJson = doc.toJSON()
        const filtered = filterEntityBySchema( docAsJson, schema )
        const validate = tv4.validateMultiple( filtered, <tv4.JsonSchema>schema )

        if ( !validate.valid ) {
          res.status( 400 ).json( validate.errors )
          return
        }

        const product = await doc.save()

        res.json( product.toJSON() )
      } catch ( err ) {
        jsonError( res, err )
      }
    }

    const putHandlers = fileHandlers( putHandler )

    return {
      [ routeName ]: {
        // get list of available ids
        get: async ( req: Request, res: Response ) => {
          try {
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
      [ `${ routeName }/:propertyName/:propertyValue` ]: {
        // get a model by a field guaranteed to be unique
        get: async ( req: Request, res: Response ) => {
          const propertyName: string = req.params.propertyName
          const propertyValue: string = req.params.propertyValue

          if ( !uniqueValuePropertyNames.includes( propertyName ) ) {
            const error = Error( `No unique property ${ propertyName } found` )

            userError( res, error )

            return
          }

          try {
            const doc = await Model.findOne( { [ propertyName ]: propertyValue } )

            if ( doc === null )
              throw new NotFoundError( `No match found for ${ propertyName } = ${ propertyValue }` )

            res.json( doc.toJSON() )
          } catch ( err ) {
            jsonError( res, err )
          }
        }
      },
      [ `${ routeName }/:id([0-9a-f]{24})` ]: {
        // get an entity by id
        get: async ( req: Request, res: Response ) => {
          const id: string = req.params.id

          try {
            const doc = await Model.findById( id )

            if ( doc === null )
              throw new NotFoundError( `No ${ title } found for ID ${ id }` )

            res.json( doc.toJSON() )
          } catch ( err ) {
            jsonError( res, err )
          }
        },
        // update an existing entity
        put: putHandlers
      },
      [ `${ routeName }/all` ]: {
        // get all entities
        get: async ( req: Request, res: Response ) => {
          try {
            const docs = await Model.find( {} )

            res.json( docs )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
      [ `${ routeName }/:propertyName` ]: {
        // get all possible values for the unique named property
        get: async ( req: Request, res: Response ) => {
          const propertyName: string = req.params.propertyName

          if ( !uniqueValuePropertyNames.includes( propertyName ) ) {
            notFoundError( res, Error( `No unique property ${ propertyName } found` ) )

            return
          }

          try {
            const values = await Model.valuesForUniqueProperty( propertyName )

            res.json( values )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
    }
  }

  const models = mongooseModels( schemaMap )
  const schemas = SchemaCollection( schemaMap )
  const { entityTitles } = schemas

  const rootRoutes: IRouteData = {
    '.': {
      get: ( req: Request, res: Response ) => {
        res.json( entityTitles.map( kebabCase ) )
      }
    }
  }

  return entityTitles.reduce( ( routeData, title ) => {
    const ctorName = pascalCase( title )
    const uniqueValuePropertyNames = schemas.uniquePropertyNames( title )
    const Model = models[ ctorName ]
    const currentRouteData = createRouteData( title, uniqueValuePropertyNames, Model )

    Object.assign( routeData, currentRouteData )

    return routeData
  }, rootRoutes )
}
