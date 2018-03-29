import { IEntitySchema } from './predicates/entity-schema'

export const uniquePropertyNames = ( entitySchema: IEntitySchema ) => {
  const { properties } = entitySchema
  const propertyNames = Object.keys( properties )

  const uniqueValuePropertyNames = propertyNames.filter( name => {
    const propertySchema = properties[ name ]

    return !!propertySchema.wsUnique
  })

  return uniqueValuePropertyNames
}
