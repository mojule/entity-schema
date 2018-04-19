import * as DomMapper from '@mojule/dom-mapper'

const options = { document }
const { to } = DomMapper( options )

export const objectToDom = <( value: any ) => HTMLElement>to
