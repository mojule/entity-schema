/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import * as assert from 'assert'
import { uniqueValues } from '../utils/unique-values'

describe( 'Utils', () => {
  describe( 'array', () => {
    describe( 'uniqueValues', () => {
      it( 'only accepts arrays', () => {
        assert.throws( () => (<any>uniqueValues)( {} ) )
      })

      it( 'only accepts object arrays', () => {
        assert.throws( () => (<any>uniqueValues)( [ 'a' ] ) )
      })

      it( 'requires every object has the property name', () => {
        const objs = [
          { name: '' },
          { name: '' },
          { bad: '' }
        ]

        assert.throws( () => uniqueValues( objs, 'name' ) )
      })

      it( 'throws on missing property name', () => {
        const objs = [
          { name: 'a' },
          { name: 'b' }
        ]

        assert.throws( () => ( <any>uniqueValues )( objs ) )
      })
    })
  })
})