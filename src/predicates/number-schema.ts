import { JSONSchema4 } from 'json-schema'

export interface NumberSchema extends JSONSchema4 {
  type: 'number'
}

export const isNumberSchema = ( value ): value is NumberSchema =>
  value && value.type === 'number'
