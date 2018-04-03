import { is } from '@mojule/is'

export interface IArraySchema {
  type: 'array'
}

export const isArraySchema = ( value ): value is IArraySchema =>
  value && value.type === 'array'

