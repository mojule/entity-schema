import { flatten, pointers, get } from '@mojule/json-pointer'

// map of propertyName to uri
export interface IFetchJsonMap {
  [ propertyName: string ]: string
}

// map of propertyName to result
export interface IFetchJsonResult {
  [ propertyName: string ]: any
}

const jsonOrError = async ( res: Response ) => {
  const result = await res.json()

  if ( res.ok ) {
    return result
  }

  const message = result ? JSON.stringify( result, null, 2 ) : ''

  throw Error( `Error ${ res.status } fetching JSON\n${ res.statusText }\n${ message }` )
}

export const fetchJson = uri => fetch( uri ).then( jsonOrError )

export const fetchJsonMultiple = ( map: IFetchJsonMap ) => {
  const result: IFetchJsonResult = {}
  const propertyNames = Object.keys( map )

  return Promise.all( propertyNames.map( propertyName => {
    const uri = map[ propertyName ]

    return fetchJson( uri ).then( obj => {
      result[ propertyName ] = obj
    } )
  } ) ).then( () => result )
}

const sendJson = ( uri: string, model: any, method: 'POST' | 'PUT' = 'POST' ) =>
  fetch( uri, {
    method,
    body: JSON.stringify( model ),
    headers: new Headers( {
      'Content-Type': 'application/json'
    } )
  } )
    .then( jsonOrError )

export const postJson = sendJson

export const putJson = ( uri: string, model: any ) =>
  sendJson( uri, model, 'PUT' )

const sendFormData = ( uri: string, model: any, method: 'POST' | 'PUT' = 'POST' ) => {
  const formData = new FormData()

  const { _files } = model

  delete model[ '_files' ]

  const flat = flatten( model )

  Object.keys( flat ).forEach( pointer => {
    formData.append( pointer, JSON.stringify( flat[ pointer ] ) )
  } )

  if ( _files ) {
    Object.keys( _files ).forEach( pointer => {
      formData.append( pointer, _files[ pointer ] )
    } )
  }

  return fetch( uri, {
    method,
    body: formData
  } )
    .then( jsonOrError )
}

export const postFormData = sendFormData

export const putFormData = ( uri: string, model: any ) =>
  sendFormData( uri, model, 'PUT' )
