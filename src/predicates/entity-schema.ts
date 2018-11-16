import { ObjectSchema, isObjectSchema } from './object-schema'

export interface EntitySchema extends ObjectSchema {
  format: 'workingspec-entity'
}

export const isEntitySchema = ( value ) : value is EntitySchema =>
  value &&
  value.format === 'workingspec-entity' &&
  isObjectSchema( value )
