import * as Mapper from '@mojule/mapper'
import { JSONSchema4 } from 'json-schema'
import { SchemaResolver, SchemaMapper } from './types'
import { is } from '@mojule/is'

export const NormalizeSchema = ( resolve : SchemaResolver ) : SchemaMapper => {
  const predicates = {
    $ref: subject => is.object( subject ) && is.string( subject.$ref )
  }

  const map = {
    /*
      According to the spec, any schema with a $ref property should be entirely
      replaced with the schema it references, not extended
    */
    $ref: ( value, { mapper } ) => {
      const id = value.$ref

      return mapper( resolve( id ) )
    }
  }

  const normalize = Mapper({ map, predicates })

  return normalize
}
