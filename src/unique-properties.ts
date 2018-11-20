import { EntitySchema } from '@entity-schema/predicates'

export const uniquePropertyNames = ( entitySchema: EntitySchema ) => {
  const { properties } = entitySchema
  const propertyNames = Object.keys( properties )

  const uniqueValuePropertyNames = propertyNames.filter( name => {
    const propertySchema = properties[ name ]

    return !!propertySchema._esUnique
  })

  return uniqueValuePropertyNames
}
