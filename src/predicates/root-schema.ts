import { isTypedSchema, TypedSchema } from './typed-schema'
import { is } from '@mojule/is'

export interface RootSchema extends TypedSchema {
  id: string
}

export const isRootSchema = ( value ) : value is RootSchema =>
  value &&
  is.string( value.id ) &&
  isTypedSchema( value )
