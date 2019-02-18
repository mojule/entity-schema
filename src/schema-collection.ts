import * as tv4 from 'tv4'
import { JSONSchema4 } from 'json-schema'
import { Schema } from 'mongoose'
import { schemaToMongooseSchema } from './schema-to-mongoose-schema'
import { interfaceSchemaMapper } from './interface-schema-mapper'
import { uniquePropertyNames } from './unique-properties'
import { filterEntityBySchema } from './filter-entity-by-schema'
import { uploadablePropertyNames } from './uploadable-properties'
import { Role, EntityAccess, EntityAccesses } from './security/types'
import { FilterSchemaForRoles } from './filter-schema-for-roles'
import { is } from '@mojule/is'
import { SchemaCollectionApi } from './types'
import { RootSchema, EntitySchema, predicates } from '@entity-schema/predicates'
import { resolveRefSchemas, createRootSchemaMap, RootSchemaMap } from '@entity-schema/collection'

export const SchemaCollection = ( schemas: RootSchema[], userRoles?: Role[], accesses: EntityAccess[] = [ EntityAccesses.read ] ): SchemaCollectionApi => {
  if( Array.isArray( userRoles ) ){
    schemas = <RootSchema[]>schemas.map(
      schema => {
        const filterForRoles = FilterSchemaForRoles( schema )

        return filterForRoles( userRoles, accesses )
      }
    ).filter( schema => !is.empty( schema ) )
  }

  const map = createRootSchemaMap( schemas )
  const validator = tv4.freshApi()

  const titles : string[] = []
  const titleMap : RootSchemaMap = {}
  const entitySchemas : EntitySchema[] = []
  const entityTitles : string[] = []
  const enumTitles: string[] = []

  schemas.forEach( schema => {
    const { title } = schema

    titles.push( title )
    titleMap[ title ] = schema

    if( predicates.entitySchema( schema ) ){
      entitySchemas.push( schema )
      entityTitles.push( title )
    }

    if( predicates.enumSchema( schema ) ){
      enumTitles.push( title )
    }

    tv4.addSchema( <tv4.JsonSchema>schema )
  })

  const assertTitle = title => {
    if( !titles.includes( title ) )
      throw Error( `No schema in collection with title ${ title }` )
  }

  const assertEntityTitle = title => {
    if( !entityTitles.includes( title ) )
      throw Error( `No entity schema in collection with title ${ title }` )
  }

  const normalizedSchemaCache = new Map<string, RootSchema>()
  const interfaceSchemaCache = new Map<string, JSONSchema4>()
  const mongooseSchemaCache = new Map<string, Schema>()

  const api: SchemaCollectionApi = {
    get titles(){
      return titles.slice()
    },
    get entityTitles(){
      return entityTitles.slice()
    },
    get enumTitles(){
      return enumTitles.slice()
    },
    get validator() {
      return validator
    },
    get entities() {
      return entitySchemas.slice()
    },
    get map() {
      return JSON.parse( JSON.stringify( map ) )
    },
    get: ( title: string ) => {
      assertTitle( title )

      return <RootSchema>titleMap[ title ]
    },
    normalize: ( title: string ) => {
      assertTitle( title )

      if( normalizedSchemaCache.has( title ) )
        return normalizedSchemaCache.get( title )!

      const schema = titleMap[ title ]
      const normalizedSchema = resolveRefSchemas( schema.id, map )

      normalizedSchemaCache.set( title, normalizedSchema )

      return normalizedSchema
    },
    // modifies a schema to be compatible with the schema-to-interface code
    // eg changes title to ISomeSchema etc
    interfaceSchema: ( title: string ) => {
      assertTitle( title )

      if( interfaceSchemaCache.has( title ) )
        return interfaceSchemaCache.get( title )!

      const schema = api.normalize( title )
      const interfaceSchema = interfaceSchemaMapper( schema )

      interfaceSchemaCache.set( title, interfaceSchema )

      return interfaceSchema
    },
    mongooseSchema: ( title: string ) => {
      assertEntityTitle( title )

      if( mongooseSchemaCache.has( title ) )
        return mongooseSchemaCache.get( title )!

      const schema = <EntitySchema>api.normalize( title )

      const mongooseSchema = schemaToMongooseSchema( schema )

      mongooseSchemaCache.set( title, mongooseSchema )

      return mongooseSchema
    },
    uniquePropertyNames: ( title: string ) => {
      assertEntityTitle( title )

      const schema = <EntitySchema>api.normalize( title )

      return uniquePropertyNames( schema )
    },
    uploadablePropertyNames: ( title: string ) => {
      assertEntityTitle( title )

      const schema = <EntitySchema>api.normalize( title )

      return uploadablePropertyNames( schema )
    },
    filterEntity: <TEntityModel>( title: string, entity: TEntityModel ) => {
      assertEntityTitle( title )

      const schema = <EntitySchema>api.normalize( title )

      return filterEntityBySchema<TEntityModel>( entity, schema )
    },
    parent: ( title: string ) : string | undefined => {
      assertEntityTitle( title )

      const schema = <EntitySchema>api.normalize( title )

      if( schema.wsParent ) return schema.wsParent
    },
    parentProperty: ( title: string ) : string | undefined => {
      assertEntityTitle( title )

      const schema = <EntitySchema>api.normalize( title )

      if( schema._esParentKey ) return schema._esParentKey
    }
  }

  return api
}
