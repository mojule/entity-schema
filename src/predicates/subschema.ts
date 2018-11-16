import { RefSchema, isRefSchema } from './ref-schema'
import { TypedSchema, isTypedSchema } from './typed-schema'

export type Subschema = RefSchema | TypedSchema

export const isSubschema = ( value ) : value is Subschema =>
  isRefSchema( value ) || isTypedSchema( value )
