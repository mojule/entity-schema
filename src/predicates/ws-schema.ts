import { JSONSchema4 } from 'json-schema'
import { is } from '@mojule/is'

export type WsSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array'

export interface IWsSchema extends JSONSchema4 {
  title: string,
  type: WsSchemaType
}

const schemaTypes = [
  'string', 'number', 'integer', 'boolean', 'object', 'array'
]

export const isWsSchema = ( value ) : value is IWsSchema =>
  is.object( value ) &&
  is.string( value.title ) &&
  schemaTypes.includes( value.type )
