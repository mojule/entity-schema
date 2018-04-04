import * as tv4 from 'tv4'
import { JSONSchema4 } from 'json-schema'
import { SchemaMap, ISchemaMap, IAppSchemaMap } from './schema-map'
import { NormalizeSchema } from './normalize-schema'
import { predicates } from './predicates'
import { uniqueValues } from './utils/unique-values'
import { Schema } from 'mongoose'
import { schemaToMongooseSchema } from './schema-to-mongoose-schema'
import { interfaceSchemaMapper } from './interface-schema-mapper'
import { uniquePropertyNames } from './unique-properties'
import { filterEntityBySchema } from './filter-entity-by-schema'
import { IAppSchema } from './predicates/app-schema'
import { IEntitySchema } from './predicates/entity-schema'
import { uploadablePropertyNames } from './uploadable-properties'

const SchemaMapResolver = ( schemaMap: ISchemaMap ) =>
  ( id: string ): JSONSchema4 => schemaMap[ id ]

const validateSchemas = ( schemas : IAppSchema[] ) => {
  if( !Array.isArray( schemas ) ){
    throw Error( 'Expected an array of app schema' )
  }

  const badSchemas = schemas.filter( schema => !predicates.appSchema( schema ) )

  if( badSchemas.length ){
    let err = Error( `${ badSchemas.length } bad schemas found` )

    try {
      const badSchemaList = badSchemas.map( bad => JSON.stringify( bad ) ).join( '\n' )

      err =  Error( `Bad schemas:\n${ badSchemaList }` )
    } catch( e ){
      throw err
    }

    throw err
  }

  if( schemas.length === 0 )
    throw Error( 'Must provide at least one schema' )

  if( !uniqueValues( schemas, 'title' ) )
    throw Error( 'Expected title property to be unique within schemas' )
}

export const SchemaCollection = ( schemas : IAppSchema[] ) => {
  validateSchemas( schemas )

  const map = SchemaMap( schemas )
  const resolver = SchemaMapResolver( map )
  const normalize = NormalizeSchema( resolver )
  const validator = tv4.freshApi()

  const titles : string[] = []
  const titleMap : IAppSchemaMap = {}
  const entitySchemas : IEntitySchema[] = []
  const entityTitles : string[] = []
  const enumTitles: string[] = []

  schemas.forEach( schema => {
    const { title } = schema

    titles.push( title )
    titleMap[ title ] = schema

    if( predicates.entitySchema( schema ) ){
      entitySchemas.push( <IEntitySchema>schema )
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

  const normalizedSchemaCache = new Map<string, IAppSchema>()
  const interfaceSchemaCache = new Map<string, JSONSchema4>()
  const mongooseSchemaCache = new Map<string, Schema>()

  const api = {
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
    get: ( title: string ) => {
      assertTitle( title )

      return <IAppSchema>titleMap[ title ]
    },
    normalize: ( title: string ) => {
      assertTitle( title )

      if( normalizedSchemaCache.has( title ) )
        return normalizedSchemaCache.get( title )!

      const normalizedSchema = <IAppSchema>normalize( titleMap[ title ] )

      normalizedSchemaCache.set( title, normalizedSchema )

      return normalizedSchema
    },
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

      const schema = <IEntitySchema>api.normalize( title )

      const mongooseSchema = schemaToMongooseSchema( schema )

      mongooseSchemaCache.set( title, mongooseSchema )

      return mongooseSchema
    },
    uniquePropertyNames: ( title: string ) => {
      assertEntityTitle( title )

      const schema = <IEntitySchema>api.normalize( title )

      return uniquePropertyNames( schema )
    },
    uploadablePropertyNames: ( title: string ) => {
      assertEntityTitle( title )

      const schema = <IEntitySchema>api.normalize( title )

      return uploadablePropertyNames( schema )
    },
    filterEntity: <TEntityModel>( title: string, entity: TEntityModel ) => {
      assertEntityTitle( title )

      const schema = <IEntitySchema>api.normalize( title )

      return filterEntityBySchema<TEntityModel>( entity, schema )
    },
    parent: ( title: string ) : string | undefined => {
      assertEntityTitle( title )

      const schema = <IEntitySchema>api.normalize( title )

      if( schema.wsParent ) return schema.wsParent
    },
    parentProperty: ( title: string ) : string | undefined => {
      assertEntityTitle( title )

      const schema = <IEntitySchema>api.normalize( title )

      if( schema.wsParentProperty ) return schema.wsParentProperty
    }
  }

  return api
}
