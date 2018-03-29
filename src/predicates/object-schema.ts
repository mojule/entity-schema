import { is } from '@mojule/is'
import { IAppSchema, isAppSchema } from './app-schema'
import { TSubschema, isSubschema } from './subschema'
import { isEntitySchema } from './entity-schema'

export interface IObjectSchemaProperties {
  [ name: string ]: TSubschema
}

export interface IObjectSchema extends IAppSchema {
  type: 'object'
  properties: IObjectSchemaProperties
  additionalProperties: false
}

export const isObjectSchemaProperties = ( value ) : value is IObjectSchemaProperties =>
  is.object( value ) &&
  Object.keys( value ).every( key =>
    isSubschema( value[ key ] ) &&
    !isEntitySchema( value[ key ] )
  )

export const isObjectSchema = ( value ) : value is IObjectSchema =>
  isAppSchema( value ) && value.type === 'object' &&
  isObjectSchemaProperties( value.properties ) &&
  value.additionalProperties === false
