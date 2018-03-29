import { subschemaMap } from './subschema-map'
import { flatten, expand } from '@mojule/json-pointer'
import { escapeRegExp } from 'lodash'
import { EntityModel } from '../models/interfaces/entity-model'
import { IEntitySchema } from './predicates/entity-schema'

export const filterEntityBySchema = ( entity: EntityModel, schema: IEntitySchema ) => {
  const schemaPathMap = subschemaMap( schema )
  const entityPathMap = flatten( entity )

  const filteredEntityPathMap = {}

  const schemaPathRegexps = Object.keys( schemaPathMap ).map( pointerPath => {
    // first, replace instances of [] in the path with a token
    const arrayRefsToTokens = pointerPath.replace( /\[\]/g, '~~array~~' )
    // escape out any characters in path that clash with regexp
    const asRegex = escapeRegExp( arrayRefsToTokens )
    // replace the array token with a regexp to match one or more digits
    const replaceArrayWithDigitRegexp = asRegex.replace( /~~array~~/g, '\\d+' )

    return new RegExp( '^' + replaceArrayWithDigitRegexp + '$' )
  })

  Object.keys( entityPathMap ).forEach( pointerPath => {
    if( schemaPathRegexps.some( regexp => regexp.test( pointerPath ) ) )
      filteredEntityPathMap[ pointerPath ] = entityPathMap[ pointerPath ]
  })

  const filteredEntity = expand( filteredEntityPathMap )

  return <EntityModel>filteredEntity
}