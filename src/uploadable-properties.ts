import { ObjectSchema } from './predicates/object-schema'

export const uploadablePropertyNames = ( objectSchema: ObjectSchema ) => {
  const { properties } = objectSchema
  const propertyNames = Object.keys( properties )

  const uploadablePropertyNames = propertyNames.filter( name => {
    const propertySchema = properties[ name ]

    return !!propertySchema.wsUploadable
  })

  return uploadablePropertyNames
}
