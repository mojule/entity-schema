import { startCase } from 'lodash'
import { TitlesAnchorNav, ActionList, AppPage, ErrorPage } from '../templates'
import { fetchJson } from '../utils/fetch-json'
import { documentFragment, h2, h3 } from '../utils/h'
import { objectToDom } from '../utils/object-to-dom'
import { IClientRouterMap } from './client-router'
import { strictSelect } from '@mojule/dom-utils'
import { RootSchema } from '@entity-schema/predicates'

const linkifySchemaDom = ( schemaDom: HTMLElement ) => {
  const $refs = schemaDom.querySelectorAll( 'td[data-name="$ref"]' )

  for( let td of $refs ){
    const uri : string = (<any>td).dataset.value
    const url = new URL( uri )
    const path = url.pathname

    const link = document.createElement( 'a' )

    link.href = '#' + path

    while( td.firstChild )
      link.appendChild( td.firstChild )

    td.appendChild( link )
  }
}

const getApiKey = () => {
  const clientDiv = <HTMLDivElement>strictSelect( document, '.client' )
  const { apiKey } = clientDiv.dataset

  if ( apiKey )
    return 'Basic ' + apiKey
}

export const schemaRoutes: IClientRouterMap = {
  '/schema/:title?/:mode?': async ( req, res ) => {
    const title : string | undefined = req.params.title
    const mode : 'normalized' | undefined = req.params.mode

    try {
      const titles = await fetchJson( '/schema', getApiKey() )

      const schema : RootSchema | undefined =
        title ?
        mode === 'normalized' ?
        await fetchJson( `/schema/${ title }/normalized`, getApiKey() ) :
        await fetchJson( `/schema/${ title }`, getApiKey() ) :
        undefined

      const schemaNav = TitlesAnchorNav({
        routePrefix: '/schema',
        titles,
        currentTitle: title
      })

      const content = documentFragment(
        h2( 'Schemas' ),
        schemaNav
      )

      if( schema && title ){
        const schemaDom = objectToDom( schema )

        linkifySchemaDom( schemaDom )

        content.appendChild( h3( startCase( title ) ) )

        if( mode !== 'normalized' ){
          content.appendChild( ActionList([{
            title: 'Resolve $refs',
            path: req.path + '/normalized'
          }]) )
        }

        content.appendChild( schemaDom )
      }

      res.send( AppPage({ currentPath: '/schema' }, content ) )
    } catch( err ){
      res.send( ErrorPage( err ) )
    }
  }
}
