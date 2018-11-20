import * as assert from 'assert'

import {
  validAppSchema, validEntitySchema
} from './fixtures/schema'

import { generateTypescript } from '../typescript/generate-typescript'
import { RootSchema } from '@entity-schema/predicates'


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