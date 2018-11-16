import { ObjectSchema, isObjectSchema } from './object-schema'

export interface EntitySchema extends ObjectSchema {
  format: 'entity-schema'
}

export const isEntitySchema = ( value ) : value is EntitySchema =>
  value &&
  value.format === 'entity-schema' &&
  isObjectSchema( value )
