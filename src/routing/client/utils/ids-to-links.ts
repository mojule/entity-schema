import { fetchJson } from './fetch-json'
import { AnchorLinkItemModel } from '../templates/anchor-link-item'
import { getApiKey } from './get-api-key'

const idToNameMap = new Map<string, string>()

export const getName = async ( title: string, id: string ) => {
  if ( !idToNameMap.has( id ) ) {
    const result = await fetchJson( `/api/v1/${ title }/${ id }`, getApiKey() )

    if ( title === 'schema' && typeof result[ 'title' ] === 'string' ) {
      idToNameMap.set( id, result[ 'title' ] )
    } else if ( typeof result[ 'name' ] === 'string' ) {
      idToNameMap.set( id, result[ 'name' ] )
    } else {
      idToNameMap.set( id, id )
    }
  }

  return idToNameMap.get( id )!
}

export const idsToLinks = async ( ids: string[], routePrefix: string, current?: string ) => {
  const links: AnchorLinkItemModel[] = []

  for ( let i = 0; i < ids.length; i++ ) {
    const id = ids[ i ]
    const name = await getName( routePrefix, id )

    const model: AnchorLinkItemModel = {
      title: name,
      path: routePrefix + '/' + id,
      isCurrent: id === current
    }

    links.push( model )
  }

  return links
}
