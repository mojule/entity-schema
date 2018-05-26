import {
  flatten, pointerValueArray, globPointerValues, get,
  pointerValueArrayToPointerMap, expand, PointerValue
} from '@mojule/json-pointer'

import { Role, Roles, EntityAccess, EntityAccesses } from './security/types'
import { IAppSchema } from './predicates/app-schema'

const getParentPath = ( path: string, search: string ) => {
  const segs = path.split( '/' )
  const searchIndex = segs.indexOf( search )

  if ( searchIndex === -1 ) return

  return segs.slice( 0, searchIndex ).join( '/' )
}

const securityGlob = '**/wsSecurity/**'

const getSecurePaths = ( pvas: PointerValue[] ) => {
  const securityPvs = globPointerValues( pvas, securityGlob )
  const securePointerNames = new Set<string>()

  securityPvs.forEach( pv => {
    const parentPath = getParentPath( pv.pointer, 'wsSecurity' )

    if ( parentPath !== undefined ) securePointerNames.add( parentPath )
  } )

  const securePaths = Array.from( securePointerNames )

  return securePaths
}

export const FilterSchemaForRoles = ( schema: IAppSchema ) => {
  const flat = flatten( schema )
  const pvas = pointerValueArray( flat )
  const securePaths = getSecurePaths( pvas )

  const securityMap = securePaths.reduce( ( map, pointer ) => {
    map[ pointer ] = get( schema, pointer + '/wsSecurity' )
    return map
  }, <any>{} )

  const filterSchemaForRoles = ( userRoles: Role[], accesses: EntityAccess[] = [ EntityAccesses.read ] ): IAppSchema | {} => {
    const hasAccess = ( propertyPath: string, isProperty = false ) => {
      return accesses.every( access => {
        // no delete access exists on properties
        if ( access === EntityAccesses.delete && isProperty ) return true

        const expectedRoles = securityMap[ propertyPath ][ access ]

        if ( !expectedRoles ) throw Error( `Could not find access at ${ propertyPath }/${ access }` )

        return expectedRoles.some( expectedRole => userRoles.includes( expectedRole ) )
      } )
    }

    const filteredPvs = pvas.filter( pv => {
      if ( !userRoles.includes( Roles.admin ) && pv.pointer.includes( '/ws' ) ) return false

      if ( pv.pointer.includes( '/required/' ) ) {
        const parent = getParentPath( pv.pointer, 'required' )

        const propertyPath = parent + '/properties/' + pv.value

        if ( propertyPath in securityMap ) {
          return hasAccess( propertyPath, true )
        }
      }

      const securePath = securePaths.find( sp => pv.pointer.startsWith( sp ) )

      if ( securePath === undefined ) {
        return true
      }

      return hasAccess( securePath )
    } )

    const pointerMap = pointerValueArrayToPointerMap( filteredPvs )
    const filteredSchema = expand( pointerMap )

    return filteredSchema
  }

  return filterSchemaForRoles
}
