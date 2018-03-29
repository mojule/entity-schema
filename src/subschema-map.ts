import { IEntitySchema } from './predicates/entity-schema'
import { schemaWalk } from './schema-walk';

export const subschemaMap = ( schema: IEntitySchema ) => {
  const schemaMap = {}

  schemaWalk( schema, ( subSchema, path ) => {
    schemaMap[ path ] = subSchema
  })

  return schemaMap
}
