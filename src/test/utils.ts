import * as assert from 'assert'
import { uniqueValues } from '../utils/unique-values'
import { arrayPointerInfo } from '../utils/arrays-in-path';

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

  it( 'arrays-in-paths', () => {
    const map = {
      '/foo/0': 'Foo',
      '/foo/1': 'Bar',
      '/bar/0/baz': 'Baz',
      '/bar/0/qux/0': 'Qux 0',
      '/bar/0/qux/1': 'Qux 1',
      '/baz': []
    }

    const expect = {
      '/foo': 2,
      '/bar': 1,
      '/bar/0/qux': 2,
      '/baz': 0
    }

    const arrayInfo = arrayPointerInfo( map )

    assert.deepEqual( arrayInfo, expect )
  })
})
