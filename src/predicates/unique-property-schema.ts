import { TypedSchema, isTypedSchema } from './typed-schema'

export interface UniquePropertySchema extends TypedSchema {
  _esUnique: true
}

export const isUniquePropertySchema = ( value ) : value is UniquePropertySchema =>
  value &&
  value._esUnique === true &&
  isTypedSchema( value )
