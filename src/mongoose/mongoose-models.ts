import * as mongoose from 'mongoose'
import * as camelCase from 'lodash.camelcase'
import { IAppSchema } from '../predicates/app-schema'
import { SchemaCollection } from '../schema-collection'
import { pascalCase } from '../utils/pascal-case'
import { IExistingValuesMap } from '../add-uniques'

export const mongooseModels = <TMongooseModels>( schemaMap: IAppSchema[] ) => {
  const appSchemas = SchemaCollection( schemaMap )

  const createCtor = ( title: string ) => {
    const parentProperty = appSchemas.parentProperty( title )
    const schema = appSchemas.mongooseSchema( title )
    const ctorName = pascalCase( title )

    schema.statics.uniquePropertyNames = () => appSchemas.uniquePropertyNames( title )

    schema.statics.valuesForUniqueProperty = async function( propertyName: string, parentId?: string ): Promise<string[]> {
      const uniques = appSchemas.uniquePropertyNames( title )

      if ( !uniques.includes( propertyName ) )
        throw Error( `${ propertyName } is not a unique property` )

      const model: mongoose.Model<mongoose.Document> = this.model( ctorName )

      let condition = {}

      if ( parentProperty && parentId ) {
        condition[ parentProperty ] = parentId
      }

      const docs = await model.find( condition, propertyName ).exec()
      const values = docs.map( doc => doc[ propertyName ] )

      return values
    }

    schema.statics.uniqueValuesMap = async function( parentId?: string ): Promise<IExistingValuesMap> {
      const result: IExistingValuesMap = {}
      const names = appSchemas.uniquePropertyNames( title )

      return Promise.all( names.map( propertyName => {
        const model = this.model( ctorName )

        return model.valuesForUniqueProperty( propertyName, parentId )
          .then( values => {
            return { propertyName, values }
          } )
      } ) )
        .then( values => {
          return values.reduce( ( map, value ) => {
            const { propertyName, values } = value

            map[ propertyName ] = values

            return map
          }, {} )
        } )
    }

    return mongoose.model( ctorName, schema )
  }

  return <TMongooseModels>appSchemas.entityTitles.reduce( ( models, title ) => {
    const ctorName = pascalCase( title )
    const Ctor = mongoose.models[ ctorName ] || createCtor( title )

    models[ ctorName ] = Ctor

    return models
  }, {} )
}
