import { IEntitySchema } from './predicates/entity-schema'
import { schemaWalk } from './schema-walk'
import { isEntityReferenceSchema } from './predicates/entity-reference-schema'

export const linkTitlesForSchema = ( entitySchema: IEntitySchema ) => {
  const titles : string[] = []

  schemaWalk( entitySchema, subSchema => {
    if( isEntityReferenceSchema( subSchema ) ){
      const title = subSchema.properties.entityType.default

      titles.push( title )
    }
  })

  return titles
}
