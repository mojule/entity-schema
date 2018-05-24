import {
  flatten, pointerValueArray, globPointerValues, get,
  pointerValueArrayToPointerMap, expand
} from '@mojule/json-pointer'

import { Role, Roles } from './security/types'
import { IAppSchema } from './predicates/app-schema'

const getParentPath = ( path: string, search: string ) => {
  const segs = path.split( '/' )
  const searchIndex = segs.indexOf( search )

  if ( searchIndex === -1 ) return

  return segs.slice( 0, searchIndex ).join( '/' )
}

export const FilterSchemaForRoles = ( schema: IAppSchema ) => {
  const flat = flatten( schema )
  const pvas = pointerValueArray( flat )
  const securityGlob = '**/wsSecurity/**'
  const securityPvs = globPointerValues( pvas, securityGlob )
  const securePointerNames = new Set<string>()

  securityPvs.forEach( pv => {
    const parentPath = getParentPath( pv.pointer, 'wsSecurity' )

    if ( parentPath !== undefined ) securePointerNames.add( parentPath )
  } )

  const securePaths = Array.from( securePointerNames )

  const securityMap = securePaths.reduce( ( map, pointer ) => {
    map[ pointer ] = get( schema, pointer + '/wsSecurity' )
    return map
  }, <any>{} )

  const filterSchemaForRoles = ( userRoles: Role[] ): IAppSchema | {} => {
    const filteredPvs = pvas.filter( pv => {
      if ( !userRoles.includes( Roles.admin ) && pv.pointer.includes( '/ws' ) ) return false

      if ( pv.pointer.includes( '/required/' ) ) {
        const parent = getParentPath( pv.pointer, 'required' )

        const propertyPath = parent + '/properties/' + pv.value

        if ( propertyPath in securityMap ) {
          const expectedRoles = securityMap[ propertyPath ].read

          return expectedRoles.some( expectedRole => userRoles.includes( expectedRole ) )
        }
      }

      const securePath = securePaths.find( sp => pv.pointer.startsWith( sp ) )

      if ( securePath === undefined ) {
        return true
      }

      const expectedRoles = securityMap[ securePath ].read

      return expectedRoles.some( expectedRole => userRoles.includes( expectedRole ) )
    } )

    const pointerMap = pointerValueArrayToPointerMap( filteredPvs )
    const filteredSchema = expand( pointerMap )

    return filteredSchema
  }

  return filterSchemaForRoles
}
