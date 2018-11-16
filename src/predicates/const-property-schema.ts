import { TypedSchema, isTypedSchema } from './typed-schema'
import * as Is from '@mojule/is'

const { is } = Is

export interface ConstPropertySchema extends TypedSchema {
  type: 'string',
  enum: [ string ],
  readOnly: true,
  default: string
}

export const isConstPropertySchema = ( value ) : value is ConstPropertySchema =>
  value &&
  value.type === 'string' &&
  is.array( value.enum ) &&
  value.enum.length === 1 &&
  is.string( value.enum[ 0 ] ) &&
  value.readOnly === true &&
  is.string( value.default ) &&
  value.enum[ 0 ] === value.default &&
  isTypedSchema( value )
