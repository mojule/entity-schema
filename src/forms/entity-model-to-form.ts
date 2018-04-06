import { flatten } from '@mojule/json-pointer'
import { is } from '@mojule/is'
import { IEntitySchema } from '../predicates/entity-schema'
import { schemaToForm, ArrayifySymbol, OneOfSymbol, SchemaFormElement } from './schema-to-form'
import { filterEntityBySchema } from '../filter-entity-by-schema'
import { subschemaMap } from '../subschema-map'
import { strictSelect } from '@mojule/dom-utils';
import { SchemaFieldEditor } from './types';

export const entityModelToForm = <TEntityModel>( document: Document, schema: IEntitySchema, model: TEntityModel ) => {
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

  Object.keys( jsonPointerMap ).forEach( jsonPointerPath => {
    const value = jsonPointerMap[ jsonPointerPath ]

    // an empty array - nothing to populate - if it has any children, they will
    // also exists with json pointer paths, so fine to skip it here.
    if ( is.array( value ) ) return

    // if the path ends with digits, it's parent schema is an array
    if ( /\d+$/.test( jsonPointerPath ) ) {
      // get the parent schema path by removing digits from the end
      const arrayPath = jsonPointerPath.replace( /\/\d+$/, '' )

      /*
        add a new blank schema editor for the array item - the flattened json
        pointer map should be in array order, so the index of the form editor
        created below will match this newly added item
      */
      arrayifyApi[ arrayPath ].add()
    }

    if ( jsonPointerPath.endsWith( '?' ) ) {
      const radios = <HTMLInputElement[]>Array.from( schemaFormEl.querySelectorAll( `input[name="${ jsonPointerPath }"]` ) )

      radios.forEach( radio => {
        radio.checked = radio.value === String( value )
      } )

      oneOfApi[ jsonPointerPath ].toggle()

      return
    }

    const editor = <SchemaFieldEditor>strictSelect( schemaFormEl, `[id="${ jsonPointerPath }"]` )

    if ( editor.type === 'checkbox' ) {
      ( <HTMLInputElement>editor ).checked = value
    } else if ( editor.type === 'file' ) {
      const pathEditor = <HTMLInputElement>strictSelect( schemaFormEl, `[id="${ editor.id }__path"]` )
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
