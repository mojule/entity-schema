import { rootRoutes } from './root'
import { schemaRoutes } from './schema-routes'
import { entityRoutes } from './entity-routes'
import { ErrorPage } from '../templates'
import { IClientRouterMap } from './client-router';

const unmatchedRoutes : IClientRouterMap = {
  '/(.*)': ( req, res ) => {
    const err = Error( `Unexpected path ${ req.path }` )

    res.send( ErrorPage( err ) )
  }
}

export const routes : IClientRouterMap = Object.assign(
  {}, rootRoutes, schemaRoutes, entityRoutes, unmatchedRoutes
)
