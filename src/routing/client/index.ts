import { Routes, ClientDependencies } from './routes'
import { emptyElement } from './utils/empty-element'
import { hashToPath } from './utils/hash-to-path'
import { strictSelect } from '@mojule/dom-utils'
import { ClientRouter } from './routes/client-router'

export const initClient = ( deps: ClientDependencies ) => {
  const routes = Routes( deps )

  const client = <Element>strictSelect( document, '.client' )

  const send = ( node: Node ) => {
    emptyElement( client )

    client.appendChild( node )
  }

  const redirect = ( path: string ) => {
    window.location.hash = '#' + path
  }

  const router = ClientRouter( routes, send, redirect )

  const navigate = () => {
    const path = hashToPath( location.hash )

    router( path )
  }

  window.addEventListener( 'hashchange', navigate )

  navigate()
}
