import { JSONSchema4 } from '../../node_modules/@types/json-schema';

export interface IBooleanSchema extends JSONSchema4 {
  type: 'boolean'
}

export const isBooleanSchema = ( value ): value is IBooleanSchema =>
  value && value.type === 'boolean'
