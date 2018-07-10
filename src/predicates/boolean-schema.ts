import { JSONSchema4 } from 'json-schema'

export interface IBooleanSchema extends JSONSchema4 {
  type: 'boolean'
}

export const isBooleanSchema = ( value ): value is IBooleanSchema =>
  value && value.type === 'boolean'
