import { Subschema } from './subschema'
import { JSONSchema4 } from 'json-schema'

export interface ArraySchema extends JSONSchema4 {
  type: 'array'
  items?: Subschema
}

export const isArraySchema = ( value ): value is ArraySchema =>
  value && value.type === 'array'
