import { AppPage } from '../templates'
import { IClientRouterMap } from './client-router'

export const rootRoutes : IClientRouterMap = {
  '/': ( req, res ) => {
    res.send( AppPage() )
  }
}
