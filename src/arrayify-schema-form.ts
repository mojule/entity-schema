import { IH } from '@mojule/h/types'
import { strictSelect } from '../web/strict-select'
import { ArrayifySymbol } from './schema-to-form';

const arrayify = ( arrayEl: HTMLDivElement, h: IH ) => {
  const { button } = h
  const { path } = arrayEl.dataset

  if( !path ) throw Error( 'Expected array schema element to have a data-path attribute' )

  const arrayFieldset = strictSelect( arrayEl, 'fieldset' )
  // we are using [] as a convention to name the item subschema of an array schema
  const arrayItemEl = strictSelect( arrayEl, `[data-array="${ path }"]` )
  const arrayItemList = strictSelect( arrayEl, 'ol' )
  const arrayItemWrapper = <HTMLLIElement>arrayItemEl.parentNode

  arrayItemList.removeChild( arrayItemWrapper )

  const createNewArrayItem = ( index: number ) => {
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

      const labelEl = strictSelect( item, 'label' )
      labelEl.setAttribute( 'for', `/${ path }/${ index }` )

      const inputEl = strictSelect( item, 'input' )
      inputEl.setAttribute( 'id', `/${ path }/${ index }` )
    })
  }

  const add = () => {
    const listSchemaItems = Array.from( arrayItemList.querySelectorAll( `[data-schema][data-array="${ path }"]` ) )
    const newIndex = listSchemaItems.length
    const newItem = createNewArrayItem( newIndex )

    arrayItemList.appendChild( newItem )

    reindex()
  }

  arrayFieldset.appendChild(
    button( { type: 'button', click: add, data: { action: 'add', array: path } }, 'Add' )
  )

  add()

  return { add, reindex }
}

export const arrayifySchemaForm = ( schemaFormEl : HTMLFormElement, h: IH ) => {
  if( schemaFormEl[ ArrayifySymbol ] )
    throw Error( 'Schema form has already been arrayified' )

  const arraySchemaEls = <HTMLDivElement[]>Array.from(
    schemaFormEl.querySelectorAll( '[data-schema][data-type="array"]' )
  )

  const api = {}

  arraySchemaEls.forEach( arraySchemaEl => {
    const { path } = arraySchemaEl.dataset

    if( !path ) throw Error( 'Expected array schema element to have a data-path attribute' )

    // we should probably change the way paths are added to dataset etc to have leading '/'
    api[ '/' + path ] = arrayify( arraySchemaEl, h )
  })

  return api
}
