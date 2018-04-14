import { IH } from '@mojule/h/types'
import { ArrayifySymbol } from './schema-to-form'
import { strictSelect, strictGetAttribute } from '@mojule/dom-utils'

const closest = ( el: HTMLElement, selector: string ) => {
  if( el.matches( selector ) ) return el

  if( !el.parentElement ) return

  return closest( el.parentElement!, selector )
}

const reindexAttributeValue = ( existingValue: string, path: string, index: number ) => {
  const segs = existingValue.split( path + '/' )
  const [ left, right ] = segs
  const [ , ...rest ] = right.split( '/' )
  
  return [ left + path, index, ...rest ].join( '/' )  
}

const reindexElements = ( els: HTMLElement[], attributeName: string, path: string, index: number, isDataName = false ) => {  
  els.forEach( el => {
    const oldValue = isDataName ?
      el.dataset[ attributeName ]! :
      el.getAttribute( attributeName )!
    
    const newValue = reindexAttributeValue( oldValue, path, index )
    
    if( isDataName ){
      el.dataset[ attributeName ] = newValue
    } else {
      el.setAttribute( attributeName, newValue )
    }   
  })  
}

const arrayify = ( arrayEl: HTMLDivElement, h: IH ) => {
  const { button } = h
  const path = strictGetAttribute( arrayEl, 'data-path' )
  const arrayFieldset = strictSelect( arrayEl, 'fieldset' )
  // we are using [] as a convention to name the item subschema of an array schema
  const arrayItemEl = strictSelect( arrayEl, `[data-array="${ path }"]` )
  const arrayItemList = <HTMLOListElement>strictSelect( arrayEl, 'ol' )
  const arrayItemWrapper = <HTMLLIElement>closest( <HTMLElement>arrayItemEl, 'li' )

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

      const labelEls = <HTMLLabelElement[]>Array.from(
        item.querySelectorAll( 'label' )
      )

      const editorEls = <HTMLLabelElement[]>Array.from(
        item.querySelectorAll( 'input, textarea, select' )
      ) 

      const dataPathEls = <HTMLElement[]>Array.from(
        item.querySelectorAll( '[data-path]' )
      )

      reindexElements( labelEls, 'for', path, index )
      reindexElements( editorEls, 'name', path, index )
      reindexElements( dataPathEls, 'path', path, index, true )     
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
    const arrayItemEl = listSchemaItems[ index ]

    if( !arrayItemEl ) throw Error( 'No element at that index' )

    const arrayItemWrapper = <HTMLLIElement>closest( <HTMLElement>arrayItemEl, 'li' )

    arrayItemList.removeChild( arrayItemWrapper )

    reindex()

    return arrayItemWrapper
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
