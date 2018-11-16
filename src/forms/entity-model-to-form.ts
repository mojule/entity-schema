import { flatten } from '@mojule/json-pointer'
import { is } from '@mojule/is'
import { EntitySchema } from '../predicates/entity-schema'
import { schemaToForm } from './schema-to-form'
import { filterEntityBySchema } from '../filter-entity-by-schema'
import { subschemaMap } from '../subschema-map'
import { strictSelect } from '@mojule/dom-utils'
import { SchemaFieldEditor, ArrayifySymbol, OneOfSymbol, SchemaFormElement } from './types'
import { arrayPointerInfo } from '../utils/arrays-in-path'

export const entityModelToForm = <TEntityModel>( document: Document, schema: EntitySchema, model: TEntityModel ): SchemaFormElement => {
  const schemaFormEl = schemaToForm( document, schema )

  model = filterEntityBySchema( model, schema )

  const jsonPointerMap = flatten( model )

  const schemaPathMap = subschemaMap( schema )
  const oneOfSchema = {}

  Object.keys( schemaPathMap ).forEach( schemaPath => {
    const subSchema = schemaPathMap[ schemaPath ]

    if ( 'oneOf' in subSchema ) {
      const options = <any[]>subSchema.oneOf
      const title = jsonPointerMap[ schemaPath + '/kind' ]
      const index = options.findIndex( schema => schema.properties.kind.default === title )

      oneOfSchema[ schemaPath ] = {
        title, index
      }
    }
  } )

  Object.keys( oneOfSchema ).forEach( schemaPath => {
    const { index } = oneOfSchema[ schemaPath ]

    delete jsonPointerMap[ schemaPath + '/kind' ]

    Object.keys( jsonPointerMap ).forEach( jsonPointerPath => {
      if ( !jsonPointerPath.startsWith( schemaPath ) ) return

      const newPath = jsonPointerPath.replace( schemaPath, schemaPath + '/?' + index )
      jsonPointerMap[ newPath ] = jsonPointerMap[ jsonPointerPath ]

      delete jsonPointerMap[ jsonPointerPath ]
    } )

    jsonPointerMap[ schemaPath + '/?' ] = index
  } )

  const arrayifyApi = schemaFormEl[ ArrayifySymbol ]
  const oneOfApi = schemaFormEl[ OneOfSymbol ]
  const arrayInfo = arrayPointerInfo( jsonPointerMap )

  Object.keys( arrayInfo ).forEach( arrayPointerPath => {
    const length = arrayInfo[ arrayPointerPath ]

    for( let i = 0; i < length; i++ ){
      arrayifyApi[ arrayPointerPath ].add()
    }
  })

  Object.keys( jsonPointerMap ).forEach( jsonPointerPath => {
    const value = jsonPointerMap[ jsonPointerPath ]

    // an empty array - nothing to populate - if it has any children, they will
    // also exists with json pointer paths, so fine to skip it here.
    if ( is.array( value ) ) return

    if ( jsonPointerPath.endsWith( '?' ) ) {
      const radios = <HTMLInputElement[]>Array.from( schemaFormEl.querySelectorAll( `input[name="${ jsonPointerPath }"]` ) )

      radios.forEach( radio => {
        radio.checked = radio.value === String( value )
      } )

      oneOfApi[ jsonPointerPath ].toggle()

      return
    }

    const editor = <SchemaFieldEditor>strictSelect( schemaFormEl, `[name="${ jsonPointerPath }"]` )

    if ( editor.type === 'checkbox' ) {
      ( <HTMLInputElement>editor ).checked = value
    } else if ( editor.type === 'file' ) {
      const pathEditor = <HTMLInputElement>strictSelect( schemaFormEl, `[type="text"][name="${ editor.name }"]` )
      pathEditor.value = value
    } else if( editor.localName === 'select' ){
      const optionEl = <HTMLOptionElement>strictSelect( editor, `[value="${ value }"]` )

      optionEl.setAttribute( 'selected', '' )
    } else {
      editor.value = value
    }
  } )

  return schemaFormEl
}
