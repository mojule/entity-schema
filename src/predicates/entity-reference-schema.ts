import { isTypedSchema, TypedSchema } from './typed-schema'
import { is } from '@mojule/is'
import { ConstPropertySchema, isConstPropertySchema } from './const-property-schema'

export interface EntityIdSchema extends TypedSchema {
  type: 'string'
  pattern: '^[0-9a-f]{24}$'
}

export interface EntityReferenceSchema extends TypedSchema {
  type: 'object'
  properties: {
    entityId: EntityIdSchema,
    entityType: ConstPropertySchema
  }
}

export const isEntityIdSchema = ( value ) : value is EntityIdSchema =>
  value &&
  value.type === 'string' &&
  value.pattern === '^[0-9a-f]{24}$' &&
  isTypedSchema( value )

export const isEntityReferenceSchema = ( value ) : value is EntityReferenceSchema =>
  value &&
  value.type === 'object' &&
  is.object( value.properties ) &&
  isEntityIdSchema( value.properties.entityId ) &&
  isConstPropertySchema( value.properties.entityType ) &&
  isTypedSchema( value )
