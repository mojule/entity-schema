import { subschemaMap } from '..'
import { IEntitySchema } from '../predicates/entity-schema'
import { userSchema } from '../security/app-schema/user-schema'
import { flatten, glob, pointerValueArray, globPointerValues, get, pointerValueArrayToPointerMap, expand } from '@mojule/json-pointer'
import { Role, Roles } from '../security/types'
import { subschemaMapRemoveLeafNodes } from '../subschema-map-remove-leafs'
import * as SchemaMapper from '@mojule/schema-mapper'

const userSubSchemaMap = subschemaMapRemoveLeafNodes( <IEntitySchema>userSchema )

const flat = flatten( userSchema )

console.log( 'flat', JSON.stringify( flat, null, 2 ) )

const pvas = pointerValueArray( flat )

const securityGlob = '**/wsSecurity/**'

const securityPvs = globPointerValues( pvas, securityGlob )

console.log( 'securityPvs', JSON.stringify( securityPvs, null, 2 ) )

const passwordSecurity = get( userSchema, '/properties/password/wsSecurity' )

console.log( 'passwordSecurity', JSON.stringify( passwordSecurity ) )

const getParentPath = ( path: string, search: string ) => {
  const segs = path.split( '/' )
  const searchIndex = segs.indexOf( search )

  if( searchIndex === -1 ) return

  return segs.slice( 0, searchIndex ).join( '/' )
}

const getTerminalPath = ( path: string ) => {
  const segs = path.split( '/' )

  return segs[ segs.length - 1 ]
}

console.log( 'getParentPath', getParentPath( '/properties/password/wsSecurity/create/0', 'wsSecurity' ) )
console.log( 'getParentPath', JSON.stringify( getParentPath( '/wsSecurity/delete/0', 'wsSecurity' ) ) )

const securePointerNames = new Set<string>()

securityPvs.forEach( pv => {
  const parentPath = getParentPath( pv.pointer, 'wsSecurity' )

  if ( parentPath !== undefined ) securePointerNames.add( parentPath )
})

const securePaths = Array.from( securePointerNames )

const securityMap = securePaths.reduce( ( map, pointer ) => {
  map[ pointer ] = get( userSchema, pointer + '/wsSecurity' )
  return map
}, <any>{} )

console.log( 'securityMap', JSON.stringify( securityMap, null, 2 ) )

const filterSchemaForRoles = ( schema: any, userRoles: Role[] ) => {
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
    map[ pointer ] = get( userSchema, pointer + '/wsSecurity' )
    return map
  }, <any>{} )

  const filteredPvs = pvas.filter( pv => {
    if( pv.pointer.includes( '/ws' ) ) return false

    if ( pv.pointer.includes( '/required/' ) ) {
      const parent = getParentPath( pv.pointer, 'required' )

      const propertyPath = parent + '/properties/' + pv.value

      if ( propertyPath in securityMap ) {
        const expectedRoles = securityMap[ propertyPath ].read

        return expectedRoles.some( expectedRole => userRoles.includes( expectedRole ) )
      }
    }

    const securePath = securePaths.find( sp => pv.pointer.startsWith( sp ) )

    if( securePath === undefined ){
      return true
    }

    const expectedRoles = securityMap[ securePath ].read

    return expectedRoles.some( expectedRole => userRoles.includes( expectedRole ) )
  })

  const pointerMap = pointerValueArrayToPointerMap( filteredPvs )
  const filteredSchema = expand( pointerMap )

  return filteredSchema
}

const schemaForAdmin = filterSchemaForRoles( userSchema, [ Roles.admin ] )
const schemaForCurrentUser = filterSchemaForRoles( userSchema, [ Roles.currentUser ] )
const schemaForUser = filterSchemaForRoles( userSchema, [ Roles.user ] )

console.log( JSON.stringify( { schemaForAdmin, schemaForCurrentUser, schemaForUser } , null, 2 ) )

const { from, to } = SchemaMapper( { omitDefault: false })

const userDefaults = from( userSchema )

console.log( JSON.stringify( userDefaults, null, 2 ) )
