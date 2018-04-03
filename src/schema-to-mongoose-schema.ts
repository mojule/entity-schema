import * as Mapper from '@mojule/mapper'
import { ISchemaMap } from './schema-map'
import { NormalizeSchema } from './normalize-schema'
import { Schema } from 'mongoose'
import { JSONSchema4 } from 'json-schema'
import * as validate from 'mongoose-validator'
import { is } from '@mojule/is'
import { IEntitySchema } from './predicates/entity-schema'
import { IWsSchema } from './predicates/ws-schema';

const typeMap = {
  string: String,
  number: Number,
  boolean: Boolean,
  array: Array,
  object: Object,
  null: Object,
  any: Schema.Types.Mixed
}

const stringValidators = ( stringSchema : JSONSchema4, required: boolean ) => {
  const title = stringSchema.title

  const validators : any[] = []

  if( is.number( stringSchema.minLength ) || is.number( stringSchema.maxLength ) ){
    const minLength = stringSchema.minLength || 0
    const maxLength = stringSchema.maxLength || undefined

    const validator = validate({
      validator: 'isLength',
      arguments: [ minLength, maxLength ],
      passIfEmpty: !required,
      message: `${ title } should be between {ARGS[0]} and {ARGS[1]} characters`
    })

    validators.push( validator )
  }

  if( is.string( stringSchema.pattern ) ){
    const validator = validate({
      validator: 'matches',
      arguments: stringSchema.pattern,
      passIfEmpty: !required,
      message: `${ title } should match the pattern {ARGS[0]}`
    })

    validators.push( validator )
  }

  return validators
}

const propertyToSchemaField = ( entitySchema: IEntitySchema, propertyName: string ) => {
  const propertySchema = <IWsSchema>entitySchema.properties[ propertyName ]
  const propertyType: string = propertySchema.type
  const type = typeMap[ propertyType ]
  const required = Array.isArray( entitySchema.required ) && entitySchema.required.includes( propertyName )
  const schemaField: any = { type, required }

  const validators = stringValidators( propertySchema, required )

  if( validators.length )
    Object.assign( schemaField, { validate: validators } )

  return schemaField
}

export const schemaToMongooseSchema = ( entitySchema: IEntitySchema ) : Schema => {
  const schemaDefinition = Object.keys( entitySchema.properties ).reduce( ( map, key ) => {
    // don't include _id
    if( key === '_id' ) return map

    const stringValidators = propertyToSchemaField( entitySchema, key )

    map[ key ] = stringValidators

    return map
  }, {})

  const mongooseSchema = new Schema( schemaDefinition, { timestamps: true } )

  return mongooseSchema
}
