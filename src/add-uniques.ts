import { uniquePropertyNames } from './unique-properties'
import * as Mapper from '@mojule/mapper'
import { is } from '../utils/is'
import { IEntitySchema } from './predicates/entity-schema';

export interface IExistingValuesMap {
  [ propertyName: string ]: string[]
}

const clone = Mapper()

const isExistingValuesList = ( value ) : value is string[] =>
  is.array( value ) && value.every( is.string )

/*
  Remember if this is an existing schema, you should filter its own value out of
  the existingValues before passing them in or it will fail to validate!
*/
export const addUniques = ( schema: IEntitySchema, existingValues: IExistingValuesMap ) : IEntitySchema => {
  schema = clone( schema )

  const uniqueNames = uniquePropertyNames( schema )

  const { properties } = schema

  uniqueNames.forEach( propertyName => {
    const propertySchema = properties[ propertyName ]
    const values = existingValues[ propertyName ]

    if( !isExistingValuesList( values ) ) throw Error( 'Expected an array of existing property values' )

    propertySchema.not = {
      enum: values
    }
  })

  return schema
}
