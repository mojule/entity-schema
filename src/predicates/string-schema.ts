import { JSONSchema4 } from 'json-schema'

export interface IStringSchema extends JSONSchema4 {
  type: 'string'
}

export const isStringSchema = ( value ): value is IStringSchema =>
  value && value.type === 'string'
