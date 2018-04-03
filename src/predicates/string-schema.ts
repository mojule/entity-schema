import { is } from '@mojule/is'

export interface IStringSchema {
  type: 'string'
}

export const isStringSchema = ( value ): value is IStringSchema =>
  value && value.type === 'string'
