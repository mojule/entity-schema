import { TypedSchema, isTypedSchema } from './typed-schema'
import { is } from '@mojule/is'

export interface EnumSchema extends TypedSchema {
  type: 'string'
  enum: string[]
  _esTitles: string[]
}

export const isEnumSchema = ( value ) : value is EnumSchema =>
  value &&
  value.type === 'string' &&
  is.array( value.enum ) &&
  value.enum.every( is.string ) &&
  is.array( value._esTitles ) &&
  value._esTitles.every( is.string ) &&
  value.enum.length === value._esTitles.length &&
  isTypedSchema( value )
