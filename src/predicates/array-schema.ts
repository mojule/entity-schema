import { TSubschema } from './subschema'
import { JSONSchema4 } from '../../node_modules/@types/json-schema'

export interface IArraySchema extends JSONSchema4 {
  type: 'array'
  items?: TSubschema
}

export const isArraySchema = ( value ): value is IArraySchema =>
  value && value.type === 'array'
