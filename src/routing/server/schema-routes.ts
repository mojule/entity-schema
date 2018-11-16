import { Request, Response } from 'express-serve-static-core'
import * as path from 'path'
import { kebabCase } from 'lodash'
import { serverError, notFoundError } from './json-errors'
import { RootSchema } from '../../predicates/root-schema'
import { IRouteData } from './types'
import { SchemaCollection } from '../../schema-collection'
import { Roles, PropertyAccesses } from '../../security/types'
import { is } from '@mojule/is'
import { getUser, getUserSchemas } from '../../utils/get-user';

export const SchemaRoutes = ( schemaCollection: RootSchema[] ): IRouteData => {
  const schemaRoute = title => {
    const routePath = kebabCase( title )

    return {
      [ routePath ]: {
        get: ( req: Request, res: Response ) => {
          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const schema = userSchemas.get( title )

            res.json( schema )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
      [ `${ routePath }/normalized` ]: {
        get: ( req: Request, res: Response ) => {
          try {
            const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.read ] )

            if ( !userSchemas.titles.includes( title ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            const schema = userSchemas.normalize( title )

            res.json( schema )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      }
    }
  }

  const rootRoute: IRouteData = {
    '.': {
      get: ( req: Request, res: Response ) => {
        const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.read ] )
        const { titles } = userSchemas

        res.json( titles.map( kebabCase ) )
      }
    },
    'map': {
      get: ( req: Request, res: Response ) => {
        const userSchemas = getUserSchemas( req, schemaCollection, [ PropertyAccesses.read ] )

        res.json( userSchemas.map )
      }
    }
  }

  const schemas = SchemaCollection( schemaCollection )
  const { titles } = schemas

  return titles.reduce( ( routeData, title ) => {
    const currentRouteData = schemaRoute( title )

    Object.assign( routeData, currentRouteData )

    return routeData
  }, rootRoute )
}
