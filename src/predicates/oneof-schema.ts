import { IWsSchema, isWsSchema } from './ws-schema'
import { TSubschema, isSubschema } from './subschema'
import { is } from '@mojule/is'

export interface IOneOfSchema extends IWsSchema{
  oneOf: TSubschema[]
}

export const isOneOfSchema = ( value ) : value is IOneOfSchema =>
  isWsSchema( value ) &&
  is.array( value.oneOf ) &&
  value.oneOf.every( isSubschema )
