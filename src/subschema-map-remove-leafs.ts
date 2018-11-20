import { schemaWalk } from './schema-walk'
import { predicates } from '.'
import { EntitySchema } from '@entity-schema/predicates'

const clone = subject => JSON.parse( JSON.stringify( subject ) )

export const subschemaMapRemoveLeafNodes = ( schema: EntitySchema ) => {
  const schemaMap = {}

  schemaWalk( schema, ( subSchema, path ) => {
    subSchema = clone( subSchema )

    if ( predicates.oneOfSchema( subSchema ) ) {
      delete subSchema.oneOf
    } else if ( predicates.arraySchema( subSchema ) ) {
      delete subSchema.items
    } else if ( predicates.objectSchema ) {
      delete subSchema.properties
    }

    schemaMap[ path ] = subSchema
  } )

  return schemaMap
}
