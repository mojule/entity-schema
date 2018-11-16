import { JSONSchema4 } from 'json-schema'

export interface IntegerSchema extends JSONSchema4 {
  type: 'integer'
}

export const isIntegerSchema = ( value ): value is IntegerSchema =>
  value && value.type === 'integer'
