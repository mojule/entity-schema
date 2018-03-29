import { JSONSchema4 } from 'json-schema'
import { IAppSchema } from './predicates/app-schema'

export interface ISchemaMap {
  [ id: string ] : JSONSchema4
}

export interface IAppSchemaMap extends ISchemaMap {
  [ id: string ] : IAppSchema
}

export const SchemaMap = ( schemas: JSONSchema4[] ) : ISchemaMap => schemas.reduce( ( map: ISchemaMap, schema ) => {
  if( schema.id === undefined ) throw Error( 'Schema ID is required' )

  map[ schema.id ] = schema

  return map
}, {} )
