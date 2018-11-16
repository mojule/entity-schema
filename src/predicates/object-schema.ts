import { is } from '@mojule/is'
import { RootSchema, isRootSchema } from './root-schema'
import { Subschema, isSubschema } from './subschema'
import { isEntitySchema } from './entity-schema'

export interface ObjectSchemaProperties {
  [ name: string ]: Subschema
}

export interface ObjectSchema extends RootSchema {
  type: 'object'
  properties: ObjectSchemaProperties
  additionalProperties: false
}

export const isObjectSchemaProperties = ( value ) : value is ObjectSchemaProperties =>
  is.object( value ) &&
  Object.keys( value ).every( key =>
    isSubschema( value[ key ] ) &&
    !isEntitySchema( value[ key ] )
  )

export const isObjectSchema = ( value ) : value is ObjectSchema =>
  value.type === 'object' &&
  isObjectSchemaProperties( value.properties ) &&
  value.additionalProperties === false &&
  isRootSchema( value )
