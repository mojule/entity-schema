import { routes } from './routes'
import { emptyElement } from './utils/empty-element'
import { hashToPath } from './utils/hash-to-path'
import { strictSelect } from '@mojule/dom-utils'
import { ClientRouter } from './routes/client-router'

document.addEventListener( 'DOMContentLoaded', () => {
  const client = <Element>strictSelect( document, '.client' )

  const send = ( node: Node ) => {
    emptyElement( client )

    client.appendChild( node )
  }

  const router = ClientRouter( routes, send )

  const navigate = () => {
    const path = hashToPath( location.hash )

    router( path )
  }

  window.addEventListener( 'hashchange', navigate )

  navigate()
} )
