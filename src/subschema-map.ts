import { schemaWalk } from './schema-walk'
import { EntitySchema } from '@entity-schema/predicates'

export const subschemaMap = ( schema: EntitySchema ) => {
  const schemaMap = {}

  schemaWalk( schema, ( subSchema, path ) => {
    schemaMap[ path ] = subSchema
  })

  return schemaMap
}
