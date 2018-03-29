import { isWsSchema, IWsSchema } from './ws-schema'
import { is } from '@mojule/is'
import { IConstPropertySchema, isConstPropertySchema } from './const-property-schema'

export interface IEntityIdSchema extends IWsSchema {
  type: 'string'
  pattern: '^[0-9a-f]{24}$'
}

export interface IEntityReferenceSchema extends IWsSchema {
  type: 'object'
  properties: {
    entityId: IEntityIdSchema,
    entityType: IConstPropertySchema
  }
}

export const isEntityIdSchema = ( value ) : value is IEntityIdSchema =>
  isWsSchema( value ) &&
  value.type === 'string' &&
  value.pattern === '^[0-9a-f]{24}$'

export const isEntityReferenceSchema = ( value ) : value is IEntityReferenceSchema =>
  isWsSchema( value ) &&
  value.type === 'object' &&
  is.object( value.properties ) &&
  isEntityIdSchema( value.properties!.entityId ) &&
  isConstPropertySchema( value.properties!.entityType )
