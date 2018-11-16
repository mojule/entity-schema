import { JSONSchema4 } from 'json-schema'
import { is } from '@mojule/is'

export type TypedSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array'

export interface TypedSchema extends JSONSchema4 {
  title: string,
  type: TypedSchemaType
}

const schemaTypes = [
  'string', 'number', 'integer', 'boolean', 'object', 'array'
]

export const isTypedSchema = ( value ) : value is TypedSchema =>
  is.object( value ) &&
  is.string( value.title ) &&
  schemaTypes.includes( value.type )
