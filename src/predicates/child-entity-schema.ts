import { isEntitySchema, IEntitySchema } from './entity-schema'
import { is } from '@mojule/is'
import { isEntityReferenceSchema } from './entity-reference-schema'

export interface IChildEntitySchema extends IEntitySchema {
  wsParentProperty: string
}

export const isChildEntitySchema = ( value ) : value is IChildEntitySchema =>
  isEntitySchema( value ) && is.string( value.wsParentProperty ) &&
  isEntityReferenceSchema( value.properties[ value.wsParentProperty ] )
