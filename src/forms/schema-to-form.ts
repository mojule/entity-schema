import * as Mapper from '@mojule/mapper'
import * as H from '@mojule/h'
import { predicates } from '../predicates'
import { JSONSchema4 } from 'json-schema'
import { upperFirst, startCase } from 'lodash'
import { is } from '@mojule/is'
import { strictSelect } from '@mojule/dom-utils'
import { uploadablePropertyNames } from '../uploadable-properties'
import { IObjectSchema } from '../predicates/object-schema'
import { arrayifySchemaForm, ArrayifyApi } from './arrayify-schema-form'
import { oneOfSchemaForm, OneOfApi } from './oneof-schema-form'

const inputTypeMap = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox'
}

interface ISchemaElModel {
  schema: JSONSchema4,
  options: {
    pathSegs: string[],
    isRequired: boolean
  }
}

export const ArrayifySymbol = Symbol( 'arrayify' )
export const OneOfSymbol = Symbol( 'oneOf' )

const Id = ( pathSegs: string[] ) => '/' + pathSegs.join( '/' )

export interface SchemaFormElement extends HTMLFormElement {
  [ ArrayifySymbol ]: ArrayifyApi
  [ OneOfSymbol ]: OneOfApi
}

export const schemaToForm = ( document: Document, schema: IObjectSchema, arrayify = true ) => {
  const uploadableProperties = uploadablePropertyNames( schema )

  const h = H( document )

  const {
    div, label, input, documentFragment, fieldset, legend, ol, li, table, tr,
    th, td, form, textarea, select, option, p, span
  } = h

  const schemaWrapper = ( model: ISchemaElModel ) => {
    const { schema, options } = model
    const { type } = schema
    const { pathSegs } = options
    const path = pathSegs.join( '/' )

    let wrapper

    if( schema.oneOf ){
      wrapper = div({ data: { schema: '', path, oneOf: '' } })
    } else {
      if( typeof type !== 'string' ){
        throw Error( 'Expected schema to have a type' )
      }

      wrapper = div({ data: { schema: '', path, type } })
    }


    return wrapper
  }

  const enumSelect = ( model: ISchemaElModel ) => {
    const { schema, options } = model
    const { pathSegs } = options

    const items = <string[]>schema.enum || []
    const titles: string[] | undefined = schema.wsEnumTitles

    const selectOptions = items.map( ( item, i ) => {
      const title = titles ? titles[ i ] : startCase( item )

      return option( { value: item }, title )
    })

    const name = Id( pathSegs )

    return select( { name }, ...selectOptions )
  }

  const schemaInput = ( model: ISchemaElModel ) => {
    const { schema, options } = model
    const format = schema.format || ''
    const type = String( schema.type )
    const title = schema.title || upperFirst( type )
    const { pathSegs, isRequired } = options
    const path = pathSegs.join( '/' )

    const editorType =
      format === 'multiline' ?
      format :
      type === 'string' && schema.enum ?
      'enum' :
      'string'

    const schemaEl = schemaWrapper( model )
    const name = Id( pathSegs )
    let inputType = inputTypeMap[ type ]

    if( schema.readOnly ){
      inputType = 'hidden'
    }

    if( format === 'email' ){
      inputType = 'email'
    }

    if( format === 'password' ){
      inputType = 'password'
    }

    const editor =
      inputType === 'hidden' ?
      input( { name, type: inputType, data: { type } } ) :
      editorType === 'multiline' ?
      textarea( { name } ) :
      editorType === 'enum' ?
      enumSelect( model ) :
      input( { name, type: inputType, data: { type } } )

    if( inputType === 'text' ){
      if( schema.minLength )
        (<HTMLInputElement>(editor)).minLength = schema.minLength
      if( schema.maxLength )
        (<HTMLInputElement>(editor)).maxLength = schema.maxLength
      if( schema.pattern )
        (<HTMLInputElement>(editor)).pattern = schema.pattern
    }

    if( type === 'boolean' && is.boolean( schema.default ) ){
      if( inputType === 'hidden' ){
        editor.value = String( schema.default )
      } else {
        (<HTMLInputElement>editor).checked = <boolean>schema.default
      }
    } else if( type === 'number' && is.number( schema.default ) ){
      editor.value = String( schema.default )
    } else if( schema.default ){
      editor.value = String( schema.default )
    }

    if( isRequired ) editor.setAttribute( 'required', '' )

    schemaEl.appendChild(
      documentFragment(
        label( { data: { title }, for: name }, title ),
        editor,
        inputType === 'hidden' ? editor.value : ''
      )
    )

    return schemaEl
  }

  const map = {
    oneOfSchema: ( schema, options ) => {
      const { mapper, pathSegs } = options

      const schemaEl = schemaWrapper({ schema, options })
      const fields = fieldset(
        legend( schema.title || 'Options' )
      )

      const optionList = ol()
      const optionName = Id( pathSegs ) + '/?'

      fields.appendChild( optionList )

      schema.oneOf.forEach( ( subschema, i ) => {
        const newPathSegs = ( <string[]>pathSegs ).concat( `?${ i }` )
        const newOptions = Object.assign( {}, options, { pathSegs: newPathSegs } )
        const optionTitle = subschema.title || ( 'Option ' + ( i + 1 ) )
        const optionInput = input( {
          type: 'radio',
          value: String( i ),
          name: optionName
        })

        if( i === 0 ) optionInput.checked = true

        const option = li(
          label(
            optionInput, ' ' + optionTitle
          )
        )

        const subschemaEl = mapper( subschema, newOptions )

        optionList.appendChild( option )
        fields.appendChild( subschemaEl )
      })

      schemaEl.appendChild( fields )

      return schemaEl
    },
    stringSchema: ( schema, options ) => {
      const inputWrapper = schemaInput({ schema, options })

      if( schema.format === 'uri' && schema.wsUploadable ){
        const pathLabel = <HTMLLabelElement>strictSelect( inputWrapper, 'label' )
        const pathInput = <HTMLInputElement>strictSelect( inputWrapper, 'input' )
        const fileInput = <HTMLInputElement>pathInput.cloneNode( true )

        fileInput.type = 'file'

        pathInput.parentNode!.appendChild( fileInput )
        pathInput.parentNode!.appendChild( pathInput )
      }

      return inputWrapper
    },
    numberSchema: ( schema, options ) => schemaInput({ schema, options }),
    booleanSchema: ( schema, options ) => schemaInput({ schema, options }),
    nullSchema: ( schema, options ) => schemaWrapper({ schema, options }),
    arraySchema: ( schema, options ) => {
      const { mapper, pathSegs } = options

      const schemaEl = schemaWrapper({ schema, options })

      const arrayList = ol()

      if( schema.items ){
        const newPathSegs = ( <string[]>pathSegs ).concat(  [ '[]' ] )
        const newOptions = Object.assign( {}, options, { pathSegs: newPathSegs } )
        const itemSchemaEl = mapper( schema.items, newOptions )

        const firstSchemaEl =
          ( 'schema' in itemSchemaEl.dataset ) ?
          itemSchemaEl :
          <HTMLElement>strictSelect( itemSchemaEl, '[data-schema]' )

        firstSchemaEl.dataset.array = pathSegs.join( '/' )

        arrayList.appendChild( li( itemSchemaEl ) )
      }

      const arrayFieldSet = fieldset(
        legend( schema.title || 'array' ),
        arrayList
      )

      schemaEl.appendChild( arrayFieldSet )

      return schemaEl
    },
    childEntitySchema: ( schema, options ) => {
      return map.entitySchema( schema, options )
    },
    entitySchema: ( schema, options ) => {
      return fieldset(
        legend( schema.title ),
        map.objectSchema( schema, options )
      )
    },
    appSchema: ( schema, options ) => {
      return fieldset(
        legend( schema.title ),
        map.objectSchema( schema, options )
      )
    },
    entityReferenceSchema: ( schema, options ) => {
      return fieldset( map.objectSchema( schema, options ) )
    },
    constPropertySchema: ( schema, options ) => {
      return map.stringSchema( schema, options )
    },
    objectSchema: ( schema, options ) => {
      const { mapper, pathSegs } = options

      const schemaEl = schemaWrapper({ schema, options })
      const objectTable = table()

      schemaEl.appendChild( objectTable )

      if( is.object( schema.properties ) && !is.empty( schema.properties ) ){
        Object.keys( schema.properties ).forEach( key => {
          const isRequired : boolean = is.array( schema.required ) && schema.required.includes( key )
          const newPathSegs = ( <string[]>pathSegs ).concat( [ key ] )
          const newOptions = Object.assign( {}, options, { pathSegs: newPathSegs, isRequired } )

          const propertySchema =  schema.properties[ key ]
          const propertyEl = mapper( propertySchema, newOptions )
          const propertyLabel = propertyEl.querySelector( `label[data-title="${ propertySchema.title }"]` )

          const propertyRow = tr(
            th(
              propertyLabel ? propertyLabel : ( propertySchema.title || propertySchema.type ),
              isRequired ? span( { class: 'required-indicator' }, '*' ) : ''
            ),
            td( propertyEl )
          )

          objectTable.appendChild( propertyRow )
        })
      }

      schemaEl.appendChild( p( { class: 'required-message' }, '* required' ) )

      return schemaEl
    },
    refSchema: () => {
      throw Error( 'Found a $ref - schema should have been normalized!' )
    },
    anySchema: () => {
      throw Error( 'Any type not supported')
    }
  }

  const mapper = Mapper( { map, predicates } )

  const schemaFormEl = form(
    uploadableProperties.length ? {
      enctype: 'multipart/form-data'
    } : {},
    mapper( schema, { pathSegs: [] } )
  )

  if( arrayify )
    schemaFormEl[ ArrayifySymbol ] = arrayifySchemaForm( schemaFormEl, h )

  schemaFormEl[ OneOfSymbol ] = oneOfSchemaForm( schemaFormEl, h )

  return <SchemaFormElement>schemaFormEl
}
