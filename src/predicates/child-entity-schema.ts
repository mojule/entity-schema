import { isEntitySchema, EntitySchema } from './entity-schema'
import { is } from '@mojule/is'
import { isEntityReferenceSchema } from './entity-reference-schema'

export interface ChildEntitySchema extends EntitySchema {
  wsParentProperty: string
}

export const isChildEntitySchema = ( value ) : value is ChildEntitySchema =>
  value &&
  is.string( value.wsParentProperty ) &&
  isEntityReferenceSchema( value.properties[ value.wsParentProperty ] ) &&
  isEntitySchema( value )
