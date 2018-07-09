import { JSONSchema4 } from '../../node_modules/@types/json-schema'

export interface IStringSchema extends JSONSchema4 {
  type: 'string'
}

export const isStringSchema = ( value ): value is IStringSchema =>
  value && value.type === 'string'
