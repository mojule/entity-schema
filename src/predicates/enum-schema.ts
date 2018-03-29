import { IWsSchema, isWsSchema } from "./ws-schema";
import { is } from '@mojule/is'

export interface IEnumSchema extends IWsSchema {
  type: 'string'
  enum: string[]
  wsEnumTitles: string[]
}

export const isEnumSchema = ( value ) : value is IEnumSchema =>
  isWsSchema( value ) &&
  value.type === 'string' &&
  is.array( value.enum ) &&
  value.enum.every( is.string ) &&
  is.array( value.wsEnumTitles ) &&
  value.wsEnumTitles.every( is.string ) &&
  value.enum.length === value.wsEnumTitles.length
