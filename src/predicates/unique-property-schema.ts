import { TypedSchema, isTypedSchema } from './typed-schema'

export interface UniquePropertySchema extends TypedSchema {
  wsUnique: true
}

export const isUniquePropertySchema = ( value ) : value is UniquePropertySchema =>
  value &&
  value.wsUnique === true &&
  isTypedSchema( value )
