import { AppPage } from '../templates'
import { IClientRouterMap } from './client-router'

export const rootRoutes : IClientRouterMap = {
  '/': ( _req, res ) => {
    res.send( AppPage() )
  }
}
