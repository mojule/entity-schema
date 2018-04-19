import { Request, Response } from 'express-serve-static-core'
import * as path from 'path'
import { kebabCase } from 'lodash'
import { serverError } from './json-errors'
import { IAppSchema } from '../../predicates/app-schema'
import { IRouteData } from './types'
import { SchemaCollection } from '../../schema-collection'

export const SchemaRoutes = ( schemaMap: IAppSchema[] ): IRouteData => {
  const schemaRoute = title => {
    const routePath = kebabCase( title )

    return {
      [ routePath ]: {
        get: ( req: Request, res: Response ) => {
          try {
            res.json( schemas.get( title ) )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
      [ `${ routePath }/normalized` ]: {
        get: ( req: Request, res: Response ) => {
          try {
            res.json( schemas.normalize( title ) )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      }
    }
  }

  const schemas = SchemaCollection( schemaMap )
  const { titles } = schemas

  const rootRoute: IRouteData = {
    '.': {
      get: ( req: Request, res: Response ) => {
        res.json( titles.map( kebabCase ) )
      }
    },
    'map': {
      get: ( req: Request, res: Response ) => {
        res.json( schemaMap )
      }
    }
  }

  return titles.reduce( ( routeData, title ) => {
    const currentRouteData = schemaRoute( title )

    Object.assign( routeData, currentRouteData )

    return routeData
  }, rootRoute )
}
