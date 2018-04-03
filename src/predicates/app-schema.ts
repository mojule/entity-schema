import { isWsSchema, IWsSchema } from './ws-schema'
import { is } from '@mojule/is'

export interface IAppSchema extends IWsSchema {
  id: string
}

export const isAppSchema = ( value ) : value is IAppSchema =>
  value &&
  is.string( value.id ) &&
  isWsSchema( value )
