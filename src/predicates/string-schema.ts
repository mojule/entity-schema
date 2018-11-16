import { JSONSchema4 } from 'json-schema'

export interface StringSchema extends JSONSchema4 {
  type: 'string'
}

export const isStringSchema = ( value ): value is StringSchema =>
  value && value.type === 'string'
