import { JSONSchema4 } from 'json-schema'
import { RootSchema } from '@entity-schema/predicates'

export interface ISchemaMap {
  [ id: string ] : JSONSchema4
}

export interface IAppSchemaMap extends ISchemaMap {
  [ id: string ] : RootSchema
}

export const SchemaMap = ( schemas: JSONSchema4[] ) : ISchemaMap => schemas.reduce( ( map: ISchemaMap, schema ) => {
  if( schema.id === undefined ) throw Error( 'Schema ID is required' )

  map[ schema.id ] = schema

  return map
}, {} )
