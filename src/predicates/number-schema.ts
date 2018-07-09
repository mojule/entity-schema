import { JSONSchema4 } from '../../node_modules/@types/json-schema'

export interface INumberSchema extends JSONSchema4 {
  type: 'number'
}

export const isNumberSchema = ( value ): value is INumberSchema =>
  value && value.type === 'number'
