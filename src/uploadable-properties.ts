import { IObjectSchema } from './predicates/object-schema'

export const uploadablePropertyNames = ( objectSchema: IObjectSchema ) => {
  const { properties } = objectSchema
  const propertyNames = Object.keys( properties )

  const uploadablePropertyNames = propertyNames.filter( name => {
    const propertySchema = properties[ name ]

    return !!propertySchema.wsUploadable
  })

  return uploadablePropertyNames
}
