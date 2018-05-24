import { flatten, pointers, get } from '@mojule/json-pointer'

// map of propertyName to uri
export interface FetchJsonMap {
  [ propertyName: string ]: string
}

// map of propertyName to result
export interface FetchJsonResult {
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

export const fetchJson = ( uri: string, authorize?: string ) => {
  if( authorize ){
    return fetch( uri, {
      headers: new Headers({
        Authorization: authorize
      })
    } ).then( jsonOrError )
  }
  return fetch( uri ).then( jsonOrError )
}

export const fetchJsonMultiple = ( map: FetchJsonMap, authorize?: string ) => {
  const result: FetchJsonResult = {}
  const propertyNames = Object.keys( map )

  return Promise.all( propertyNames.map( propertyName => {
    const uri = map[ propertyName ]

    return fetchJson( uri, authorize ).then( obj => {
      result[ propertyName ] = obj
    } )
  } ) ).then( () => result )
}

export const postDelete = ( uri: string, authorize?: string ) => sendJson( uri, undefined, 'DELETE', authorize )

const sendJson = ( uri: string, model: any, method: 'POST' | 'PUT' | 'DELETE' = 'POST', authorize?: string ) => {
  const body = model ? JSON.stringify( model ) : model

  const headers = {
    'Content-Type': 'application/json'
  }

  if ( authorize ) {
    headers[ 'Authorization' ] = authorize
  }

  return fetch( uri, { method, body, headers: new Headers( headers ) } )
    .then( jsonOrError )
}

export const postJson = sendJson

export const putJson = ( uri: string, model: any, authorize?: string ) =>
  sendJson( uri, model, 'PUT', authorize )

const sendFormData = ( uri: string, model: any, method: 'POST' | 'PUT' = 'POST', authorize?: string ) => {
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

  const options: any = {
    method,
    body: formData
  }

  if ( authorize ) {
    options.headers = new Headers( {
      Authorization: authorize
    } )
  }

  return fetch( uri, options )
    .then( jsonOrError )
}

export const postFormData = sendFormData

export const putFormData = ( uri: string, model: any, authorize?: string ) =>
  sendFormData( uri, model, 'PUT', authorize )
