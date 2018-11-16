import * as assert from 'assert'
import * as mongoose from 'mongoose'

import {
  validAppSchema, validEntitySchema, normalizedValidEntitySchema,
  validEntitySchemaInterfaceSchema, toMongooseSchema, validEntitySchemaUniques,
  entitySchemaWithArray, entitySchemaWithLinks, entitySchemaWithLinksAdded,
  validEntitySchemaUniquesAdded,
  validEnumSchema,
  validChildSchema,
  withOneOf,
  validOneOfSchema
} from './fixtures/schema'

import { RootSchema } from '../predicates/root-schema'
import { generateTypescript } from '../typescript/generate-typescript';


describe( 'generate', () => {
  it( 'generates typescript interfaces', done => {
    const schemaMap: RootSchema[] = [ validAppSchema, validEntitySchema ]

    generateTypescript( schemaMap ).then(
      typescript => {
        const { enums, interfaces } = typescript
        assert( Array.isArray( enums ) )
        assert( Array.isArray( interfaces ) )
        done()
      }
    )
  })
})