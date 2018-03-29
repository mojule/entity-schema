import { IRefSchema, isRefSchema } from './ref-schema'
import { IWsSchema, isWsSchema } from './ws-schema'

export type TSubschema = IRefSchema | IWsSchema

export const isSubschema = ( value ) : value is TSubschema =>
  isRefSchema( value ) || isWsSchema( value )
