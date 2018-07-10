import { JSONSchema4 } from 'json-schema'

export interface INumberSchema extends JSONSchema4 {
  type: 'number'
}

export const isNumberSchema = ( value ): value is INumberSchema =>
  value && value.type === 'number'
