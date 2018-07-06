import { TSubschema } from './subschema'

export interface IArraySchema {
  type: 'array'
  items?: TSubschema
}

export const isArraySchema = ( value ): value is IArraySchema =>
  value && value.type === 'array'
