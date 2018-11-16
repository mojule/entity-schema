import { EntitySchema } from './predicates/entity-schema'

export const uniquePropertyNames = ( entitySchema: EntitySchema ) => {
  const { properties } = entitySchema
  const propertyNames = Object.keys( properties )

  const uniqueValuePropertyNames = propertyNames.filter( name => {
    const propertySchema = properties[ name ]

    return !!propertySchema.wsUnique
  })

  return uniqueValuePropertyNames
}
