import { IWsSchema, isWsSchema } from './ws-schema'

export interface IUniquePropertySchema extends IWsSchema {
  wsUnique: true
}

const isUniquePropertySchema = ( value ) : value is IUniquePropertySchema =>
  value.wsUnique === true &&
  isWsSchema( value )
