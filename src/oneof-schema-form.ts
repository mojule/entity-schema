import { IH } from '@mojule/h/types'
import { strictSelect } from '@mojule/dom-utils';

const oneOfEvents = ( oneOfElement: HTMLDivElement ) => {
  const isWired = oneOfElement.dataset.wired === 'true'

  if( isWired ) return

  oneOfElement.dataset.wired = 'true'

  const path = oneOfElement.dataset.path!

  const radios = <HTMLInputElement[]>Array.from(
    oneOfElement.querySelectorAll( `input[type="radio"][name="/${ path + '/?' }"]`)
  )

  const count = radios.length

  let selected = '0'
  radios.forEach( radio => {
    if( radio.checked ) selected = radio.value
  })

  radios.forEach( radio => {
    radio.checked = radio.value === selected
  })

  const optionEls: HTMLDivElement[] = []

  for( let i = 0; i < count; i++ ){
    const optionEl = <HTMLDivElement>strictSelect( oneOfElement, `div[data-path="${ path }/?${ i }"]` )

    optionEls.push( optionEl )
  }

  const toggleOptions = () => {
    for ( let i = 0; i < count; i++ ) {
      const optionEl = <HTMLDivElement>strictSelect( oneOfElement, `div[data-path="${ path }/?${ i }"]` )

      if( String( i ) === selected ){
        optionEl.style.display = 'block'

        const noValidateEls = optionEl.querySelectorAll( '[formnovalidate]' )

        noValidateEls.forEach( el => {
          el.removeAttribute( 'formnovalidate' )
          el.setAttribute( 'required', '' )
        })
      } else {
        optionEl.style.display = 'none'

        const requiredEls = optionEl.querySelectorAll( '[required]' )

        requiredEls.forEach( el => {
          el.removeAttribute( 'required' )
          el.setAttribute( 'formnovalidate', '' )
        } )
      }
    }
  }

  toggleOptions()

  radios.forEach( radio => {
    radio.addEventListener( 'change', () => {
      if( radio.checked ){
        selected = radio.value
      }

      toggleOptions()
    })
  })
}

export const oneOfSchemaForm = ( schemaFormEl: HTMLFormElement, h: IH ) => {
  const oneOfSchemaEls = <HTMLDivElement[]>Array.from(
    schemaFormEl.querySelectorAll( '[data-schema][data-one-of]' )
  )

  oneOfSchemaEls.forEach( oneOfEvents )
}