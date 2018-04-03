import { IObjectSchema, isObjectSchema } from './object-schema'

export interface IEntitySchema extends IObjectSchema {
  format: 'workingspec-entity'
}

export const isEntitySchema = ( value ) : value is IEntitySchema =>
  value &&
  value.format === 'workingspec-entity' &&
  isObjectSchema( value )
