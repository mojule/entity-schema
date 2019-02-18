import { JSONSchema4 } from 'json-schema'
import { Schema } from 'mongoose'
import { EntitySchema, RootSchema } from '@entity-schema/predicates'
import { RootSchemaMap } from '@entity-schema/collection'

export type SchemaMapper = ( from: JSONSchema4 ) => JSONSchema4
export type SchemaResolver = ( id : string ) => JSONSchema4

export interface SchemaCollectionApi {
  readonly titles: string[]
  readonly entityTitles: string[]
  readonly enumTitles: string[]
  readonly validator: tv4.TV4
  readonly entities: EntitySchema[]
  readonly map: RootSchemaMap
  get: ( title: string ) => RootSchema
  normalize: ( title: string ) => RootSchema
  interfaceSchema: ( title: string ) => JSONSchema4
  mongooseSchema: ( title: string ) => Schema
  uniquePropertyNames: ( title: string ) => string[]
  uploadablePropertyNames: ( title: string ) => string[]
  filterEntity: <TEntityModel>( title: string, entity: TEntityModel ) => TEntityModel
  parent: ( title: string ) => string | undefined
  parentProperty: ( title: string ) => string | undefined
}
