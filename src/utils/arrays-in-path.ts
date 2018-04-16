export interface JsonPointerMap {
  [ pointer: string ]: string | number | boolean | any[]
}

export const arrayPointerInfo = ( map: JsonPointerMap ) => {
  const arrayInfoMap: { [ pointer: string ]: number } = {}

  Object.keys( map ).forEach( pointer => {
    const pathSegs = pointer.split( '/' )

    pathSegs.forEach( ( seg, i ) => {
      const currentPath = pathSegs.slice( 0, i + 1 )
      const currentPointer = currentPath.join( '/' )
      const currentValue = map[ currentPointer ]

      if ( Array.isArray( currentValue ) && currentValue.length === 0 ){
        if ( !arrayInfoMap[ currentPointer ] ) {
          arrayInfoMap[ currentPointer ] = 0
        }
      } else if( /\d+/.test( seg ) ){
        const arrayPath = pathSegs.slice( 0, i )
        const arrayPointer = arrayPath.join( '/' )
        const size = Number( seg ) + 1

        if ( !arrayInfoMap[ arrayPointer ] || size > arrayInfoMap[ arrayPointer ] ){
          arrayInfoMap[ arrayPointer ] = size
        }
      }
    })
  })

  return arrayInfoMap
}
