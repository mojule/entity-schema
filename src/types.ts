import { JSONSchema4 } from 'json-schema'
import { IEntitySchema } from './predicates/entity-schema'
import { ISchemaMap } from './schema-map'
import { IAppSchema } from './predicates/app-schema'
import { Schema } from 'mongoose'

export type SchemaMapper = ( from: JSONSchema4 ) => JSONSchema4
export type SchemaResolver = ( id : string ) => JSONSchema4

export interface SchemaCollectionApi {
  readonly titles: string[]
  readonly entityTitles: string[]
  readonly enumTitles: string[]
  readonly validator: tv4.TV4
  readonly entities: IEntitySchema[]
  readonly map: ISchemaMap
  get: ( title: string ) => IAppSchema
  normalize: ( title: string ) => IAppSchema
  interfaceSchema: ( title: string ) => JSONSchema4
  mongooseSchema: ( title: string ) => Schema
  uniquePropertyNames: ( title: string ) => string[]
  uploadablePropertyNames: ( title: string ) => string[]
  filterEntity: <TEntityModel>( title: string, entity: TEntityModel ) => TEntityModel
  parent: ( title: string ) => string | undefined
  parentProperty: ( title: string ) => string | undefined
}
