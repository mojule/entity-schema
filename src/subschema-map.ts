import { EntitySchema } from './predicates/entity-schema'
import { schemaWalk } from './schema-walk'

export const subschemaMap = ( schema: EntitySchema ) => {
  const schemaMap = {}

  schemaWalk( schema, ( subSchema, path ) => {
    schemaMap[ path ] = subSchema
  })

  return schemaMap
}
