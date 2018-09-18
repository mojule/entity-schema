import { JSONSchema4 } from 'json-schema'

export interface IIntegerSchema extends JSONSchema4 {
  type: 'integer'
}

export const isIntegerSchema = ( value ): value is IIntegerSchema =>
  value && value.type === 'integer'
