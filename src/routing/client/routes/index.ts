import { rootRoutes } from './root-routes'
import { schemaRoutes } from './schema-routes'
import { entityRoutes } from './entity-routes'
import { ErrorPage } from '../templates'
import { IClientRouterMap } from './client-router'
import { FileRoutes } from './file-routes';

const unmatchedRoutes : IClientRouterMap = {
  '/(.*)': ( req, res ) => {
    const err = Error( `Unexpected path ${ req.path }` )

    res.send( ErrorPage( err ) )
  }
}

export interface ClientDependencies {
  resolverNames: string[]
}

export const Routes = ( deps: ClientDependencies ) => {
  const { resolverNames } = deps
  const fileRoutes = FileRoutes( resolverNames )

  return <IClientRouterMap>Object.assign(
    {}, rootRoutes, schemaRoutes, entityRoutes, fileRoutes, unmatchedRoutes
  )
}
