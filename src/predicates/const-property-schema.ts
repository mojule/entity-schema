import { IWsSchema, isWsSchema } from './ws-schema'
import * as Is from '@mojule/is'

const { is } = Is

export interface IConstPropertySchema extends IWsSchema {
  type: 'string',
  enum: [ string ],
  readOnly: true,
  default: string
}

export const isConstPropertySchema = ( value ) : value is IConstPropertySchema =>
  value &&
  value.type === 'string' &&
  is.array( value.enum ) &&
  value.enum.length === 1 &&
  is.string( value.enum[ 0 ] ) &&
  value.readOnly === true &&
  is.string( value.default ) &&
  value.enum[ 0 ] === value.default &&
  isWsSchema( value )
