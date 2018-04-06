import { IH } from '@mojule/h/types'
import { ArrayifySymbol } from './schema-to-form'
import { strictSelect, strictGetAttribute } from '@mojule/dom-utils'

const arrayify = ( arrayEl: HTMLDivElement, h: IH ) => {
  const { button } = h
  const path = strictGetAttribute( arrayEl, 'data-path' )
  const arrayFieldset = strictSelect( arrayEl, 'fieldset' )
  // we are using [] as a convention to name the item subschema of an array schema
  const arrayItemEl = strictSelect( arrayEl, `[data-array="${ path }"]` )
  const arrayItemList = <HTMLOListElement>strictSelect( arrayEl, 'ol' )
  const arrayItemWrapper = <HTMLLIElement>arrayItemEl.parentNode

  arrayItemList.removeChild( arrayItemWrapper )

  const createNewArrayItem = () => {
    const newItem = <HTMLLIElement>arrayItemWrapper.cloneNode( true )

    const remove = () => {
      arrayItemList.removeChild( newItem )

      reindex()
    }

    newItem.appendChild(
      button( { type: 'button', click: remove, data: { action: 'remove', array: path } }, 'Remove' )
    )

    return newItem
  }

  const reindex = () => {
    const listSchemaItems = Array.from( arrayItemList.querySelectorAll( `[data-schema][data-array="${ path }"]` ) )

    listSchemaItems.forEach( ( item, index ) => {
      item.setAttribute( 'data-path', `${ path }/${ index }` )

      const labelEl = <HTMLLabelElement>strictSelect( item, 'label' )
      labelEl.setAttribute( 'for', `/${ path }/${ index }` )

      const inputEl = <HTMLInputElement>strictSelect( item, 'input' )
      inputEl.setAttribute( 'id', `/${ path }/${ index }` )
    })
  }

  const add = () => {
    const newItem = createNewArrayItem()

    arrayItemList.appendChild( newItem )

    reindex()

    return newItem
  }

  const size = () => {
    const listSchemaItems = Array.from( arrayItemList.querySelectorAll( `[data-schema][data-array="${ path }"]` ) )
    return listSchemaItems.length
  }

  const remove = ( index: number ) => {
    const listSchemaItems = Array.from( arrayItemList.querySelectorAll( `[data-schema][data-array="${ path }"]` ) )
    const item = listSchemaItems[ index ]

    if( !item ) throw Error( 'No element at that index' )

    arrayItemList.removeChild( item.parentNode! )

    reindex()

    return <HTMLLIElement>item.parentNode
  }

  const get = ( index: number ) => {
    const listSchemaItems = Array.from( arrayItemList.querySelectorAll( `[data-schema][data-array="${ path }"]` ) )
    const item = listSchemaItems[ index ]

    if ( !item ) throw Error( 'No element at that index' )

    return <HTMLLIElement>item.parentNode
  }

  arrayFieldset.appendChild(
    button( { type: 'button', click: add, data: { action: 'add', array: path } }, 'Add' )
  )

  return { add, size, remove, get, reindex }
}

export interface ArrayifyApi {
  [ path: string ]: {
    add: () => HTMLLIElement
    size: () => number
    remove: ( index: number ) => HTMLLIElement
    get: ( index: number ) => HTMLLIElement
    reindex: () => void
  }
}

export const arrayifySchemaForm = ( schemaFormEl : HTMLFormElement, h: IH ) => {
  if( schemaFormEl[ ArrayifySymbol ] )
    throw Error( 'Schema form has already been arrayified' )

  const arraySchemaEls = <HTMLDivElement[]>Array.from(
    schemaFormEl.querySelectorAll( '[data-schema][data-type="array"]' )
  )

  const api: ArrayifyApi = {}

  arraySchemaEls.forEach( arraySchemaEl => {
    const path = strictGetAttribute( arraySchemaEl, 'data-path' )

    // we should probably change the way paths are added to dataset etc to have leading '/'
    api[ '/' + path ] = arrayify( arraySchemaEl, h )
  })

  return api
}
