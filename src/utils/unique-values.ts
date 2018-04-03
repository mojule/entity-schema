import { is } from '@mojule/is'

export const uniqueValues = ( objects: object[], propertyName: string ) => {
  if ( !is.array( objects ) || !objects.every( is.object ) )
    throw Error( 'Expected an array of objects' )

  if ( !objects.every( obj => propertyName in obj ) )
    throw Error( `Expected every object to have the property ${ propertyName }` )

  const values = new Set( objects.map( obj => obj[ propertyName ] ) )

  return values.size === objects.length
}
