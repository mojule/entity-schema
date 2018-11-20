import { schemaWalk } from './schema-walk'
import {
  EntitySchema, isEntityReferenceSchema
} from '@entity-schema/predicates'

export const linkTitlesForSchema = ( entitySchema: EntitySchema ) => {
  const titles : string[] = []

  schemaWalk( entitySchema, subSchema => {
    if( isEntityReferenceSchema( subSchema ) ){
      const title = subSchema.properties.entityType.default

      titles.push( title )
    }
  })

  return titles
}
