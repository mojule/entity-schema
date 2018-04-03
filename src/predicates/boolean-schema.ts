import { is } from '@mojule/is'
import { IWsSchema, isWsSchema } from './ws-schema'

export interface IBooleanSchema {
  type: 'boolean'
}

export const isBooleanSchema = ( value ): value is IBooleanSchema =>
  value && value.type === 'boolean'
