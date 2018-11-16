import { JSONSchema4 } from 'json-schema'

export interface BooleanSchema extends JSONSchema4 {
  type: 'boolean'
}

export const isBooleanSchema = ( value ): value is BooleanSchema =>
  value && value.type === 'boolean'
