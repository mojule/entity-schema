import { JSONSchema4, JSONSchema4TypeName } from 'json-schema'

export type SchemaMapper = ( from: JSONSchema4 ) => JSONSchema4
export type SchemaResolver = ( id : string ) => JSONSchema4
