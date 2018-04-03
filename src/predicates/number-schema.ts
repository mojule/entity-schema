import { is } from '@mojule/is'

export interface INumberSchema {
  type: 'number'
}

export const isNumberSchema = ( value ): value is INumberSchema =>
  value && value.type === 'number'
