import { fetchJson } from './fetch-json'
import { AnchorLinkItemModel } from '../templates/anchor-link-item'
import { getApiKey } from './get-api-key'

const nameMap = new Map<string, string>()

export const getSchemaTitle = async ( title: string ) => {
  if ( !nameMap.has( title ) ) {
    const result = await fetchJson( `/schema/${ title }` )

    if ( typeof result[ 'name' ] === 'string' ) {
      nameMap.set( title, result[ 'name' ] )
    } else {
      nameMap.set( title, title )
    }
  }

  return nameMap.get( title )!
}

export const getEntityName = async ( type: string, id: string ) => {
  if ( !nameMap.has( id ) ) {
    const result = await fetchJson( `/api/v1/${ type }/${ id }`, getApiKey() )

    if ( typeof result[ 'name' ] === 'string' ) {
      nameMap.set( id, result[ 'name' ] )
    } else {
      nameMap.set( id, id )
    }
  }

  return nameMap.get( id )!
}

export const getSchemaTitles = async( titles: string[] ) =>
  Promise.all( titles.map( getSchemaTitle ) )

export const getEntityNames = async ( type: string, ids: string[] ) =>
  Promise.all( ids.map( id => getEntityName( type, id ) ) )

export const schemaNamesToLinks = async ( names: string[], current?: string ) => {
  const links: AnchorLinkItemModel[] = []

  for ( let i = 0; i < names.length; i++ ) {
    const name = names[ i ]
    const title = await getSchemaTitle( name )

    const model: AnchorLinkItemModel = {
      title,
      path: 'schema/' + name,
      isCurrent: name === current
    }

    links.push( model )
  }

  return links
}

export const entityTypesToLinks = async( types: string[], routePrefix: string, current?: string ) => {
  const names = await getSchemaTitles( types )

  const links: AnchorLinkItemModel[] = []

  for ( let i = 0; i < types.length; i++ ) {
    const type = types[ i ]
    const title = names[ i ]
    const path = `${ routePrefix }/${ type }`
    const isCurrent = type === current

    const model: AnchorLinkItemModel = { title, path, isCurrent }


    links.push( model )
  }

  return links
}

export const entityIdsForTypeToLinks = async ( ids: string[], routePrefix: string, type: string, current?: string ) => {
  const links: AnchorLinkItemModel[] = []

  for ( let i = 0; i < ids.length; i++ ) {
    const id = ids[ i ]
    const title = await getEntityName( type, id )
    const path = `${ routePrefix }/${ type }/${ id }`
    const isCurrent = id === current

    const model: AnchorLinkItemModel = { title, path, isCurrent }

    links.push( model )
  }

  return links
}
