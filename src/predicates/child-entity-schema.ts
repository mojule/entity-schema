import { isEntitySchema, EntitySchema } from './entity-schema'
import { is } from '@mojule/is'
import { isEntityReferenceSchema } from './entity-reference-schema'

export interface ChildEntitySchema extends EntitySchema {
  _esParentKey: string
}

export const isChildEntitySchema = ( value ) : value is ChildEntitySchema =>
  value &&
  is.string( value._esParentKey ) &&
  isEntityReferenceSchema( value.properties[ value._esParentKey ] ) &&
  isEntitySchema( value )
