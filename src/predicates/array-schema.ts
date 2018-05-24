import { is } from '@mojule/is'
import { TSubschema, isSubschema } from './subschema'

export interface IArraySchema {
  type: 'array'
  items?: TSubschema
}

export const isArraySchema = ( value ): value is IArraySchema =>
  value && value.type === 'array'
