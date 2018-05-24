import { Request, Response } from 'express-serve-static-core'
import * as path from 'path'
import { kebabCase } from 'lodash'
import { serverError, notFoundError } from './json-errors'
import { IAppSchema } from '../../predicates/app-schema'
import { IRouteData } from './types'
import { SchemaCollection } from '../../schema-collection'
import { Roles } from '../../security/types';
import { is } from '@mojule/is';

export const SchemaRoutes = ( schemaMap: IAppSchema[] ): IRouteData => {
  const schemaRoute = title => {
    const routePath = kebabCase( title )

    return {
      [ routePath ]: {
        get: ( req: Request, res: Response ) => {
          try {
            const user = req.user || { roles: [ Roles.public ] }
            const schema = schemas.filterForRoles( title, user.roles )

            if( is.empty( schema ) ){
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            res.json( schema )
          } catch ( err ) {
            serverError( res, err )
          }
        }
      },
      [ `${ routePath }/normalized` ]: {
        get: ( req: Request, res: Response ) => {
          try {
            const user = req.user || { roles: [ Roles.public ] }
            const schema = schemas.filterForRoles( title, user.roles, true )

            if ( is.empty( schema ) ) {
              notFoundError( res, Error( `${ routePath } not found` ) )

              return
            }

            res.json(  )
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
        const user = req.user || { roles: [ Roles.public ] }
        const titles = schemas.titlesForRoles( user.roles )

        res.json( titles.map( kebabCase ) )
      }
    },
    'map': {
      get: ( req: Request, res: Response ) => {
        const user = req.user || { roles: [ Roles.public ] }
        const titles = schemas.titlesForRoles( user.roles )
        const schemaMapForRoles = titles.reduce( ( map, title ) => {
          const schema = <any>schemas.filterForRoles( title, user.roles )

          if( is.empty( schema ) ) return map

          map[ schema.id ] = schema

          return map
        }, {})

        res.json( schemaMapForRoles )
      }
    }
  }

  return titles.reduce( ( routeData, title ) => {
    const currentRouteData = schemaRoute( title )

    Object.assign( routeData, currentRouteData )

    return routeData
  }, rootRoute )
}
