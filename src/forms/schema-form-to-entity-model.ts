import { expand } from '@mojule/json-pointer'
import { is } from '@mojule/is'
import { SchemaFieldEditor, SchemaFormElement } from './types'

const resolveOneOf = jsonPointerToValueMap => {
  const keys = Object.keys( jsonPointerToValueMap )
  const discriminators = keys.filter( key => key.endsWith( '?' ) )

  discriminators.forEach( discriminatorKey => {
    const value = jsonPointerToValueMap[ discriminatorKey ]
    const targetKey = discriminatorKey + value

    keys.forEach( key => {
      if ( !key.startsWith( discriminatorKey ) ) return

      // if it's a match, copy to a new key without the oneOf markers
      if ( key.startsWith( targetKey ) ) {
        // remove the trailing ?
        const newPathStart = discriminatorKey.slice( 0, -1 )
        // the old oneOf path
        const find = targetKey + '/'
        // new path without oneOf marker
        const newKey = key.replace( find, newPathStart )

        jsonPointerToValueMap[ newKey ] = jsonPointerToValueMap[ key ]
      }

      // delete all oneOf keys
      delete jsonPointerToValueMap[ key ]
    } )
  } )
}

export const schemaFormToEntityModel = ( formEl: SchemaFormElement ) => {
  const editors: SchemaFieldEditor[] = Array.from( formEl.querySelectorAll( 'input, textarea, select' ) )

  const arraySubSchemaEls = <HTMLDirectoryElement[]>Array.from(
    formEl.querySelectorAll( '[data-schema][data-type="array"]' )
  )

  const arraySubschemaPaths = arraySubSchemaEls.map( el => `/${ el.dataset.path }` )

  const jsonPointerToValueMap = {}

  const _files = {}

  editors.forEach( editor => {
    const { name, type } = editor

    if ( type === 'submit' ) return

    let value: string | boolean | File = editor.value

    if ( type === 'file' ) {
      const input = <HTMLInputElement>editor

      if ( input.files && input.files[ 0 ] ) {
        _files[ name ] = input.files[ 0 ]

        return
      }
    } else if ( type === 'checkbox' ) {
      value = ( <HTMLInputElement>editor ).checked
    } else if ( type === 'hidden' && editor.dataset.type === 'boolean' ) {
      value = value === 'true'
    } else if ( type === 'radio' ) {
      if ( !( <HTMLInputElement>editor ).checked ) {
        return
      }
    }

    if ( is.string( value ) ) {
      value = value.trim()
    }

    /*
      form fields not filled out always return empty string - if not a required
      field then we shouldn't add those empty strings to the model, because if
      we do, JSON schema validation will fail as it thinks we have provided a
      value for that field
    */
    if ( !editor.required && value === '' ) return

    jsonPointerToValueMap[ name ] = value
  } )

  const jsonPaths = Object.keys( jsonPointerToValueMap )

  // ensure empty arrays
  arraySubschemaPaths.forEach( arrayPath => {
    if ( !jsonPaths.some( p => p.startsWith( arrayPath ) ) ){
      jsonPointerToValueMap[ arrayPath ] = []
    }
  })

  resolveOneOf( jsonPointerToValueMap )

  const model = expand( jsonPointerToValueMap )

  if( Object.keys( _files ).length > 0 )
    Object.assign( model, { _files } )

  return model
}
