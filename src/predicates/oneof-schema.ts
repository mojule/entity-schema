import { TypedSchema, isTypedSchema } from './typed-schema'
import { Subschema, isSubschema } from './subschema'
import { is } from '@mojule/is'

export interface OneOfSchema extends TypedSchema{
  oneOf: Subschema[]
}

export const isOneOfSchema = ( value ) : value is OneOfSchema =>
  is.array( value.oneOf ) &&
  value.oneOf.every( isSubschema ) &&
  isTypedSchema( value )
