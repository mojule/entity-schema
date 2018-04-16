/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import * as assert from 'assert'
import * as doc from '@mojule/document'
import { entityModelToForm } from '../forms/entity-model-to-form'
import { schemaFormToEntityModel } from '../forms/schema-form-to-entity-model'
import { IEntitySchema } from '../predicates/entity-schema'
import { simpleTypesSchema, simpleArraySchema, simpleEnumSchema, simpleOneOfSchema, simpleFileSchema, personSchema, personReferenceSchema, arrayOfEntitySchema } from './fixtures/forms/schema'
import { strictSelect } from '@mojule/dom-utils'
import { ArrayifySymbol, arrayifySchemaForm, predicateUtils, subschemaMap, SchemaCollection, schemaToForm } from '..'
import * as H from '@mojule/h'
import { IH } from '@mojule/h/types'
import { ILinkMap, addLinks } from '../add-links';
import { flatten } from '@mojule/json-pointer'

const document: Document = doc
const h: IH = H( document )

const roundTrip = ( entityModel, schema: IEntitySchema ) => {
  const form = entityModelToForm( document, schema, entityModel )
  const model = schemaFormToEntityModel( form )

  return model
}

describe( 'forms', () => {
  describe( 'simple types', () => {
    it( 'round trips', () => {
      const entity = {
        stringField: 'foo',
        numberField: 42,
        booleanField: true
      }

      const result = roundTrip( entity, simpleTypesSchema )

      assert.deepEqual( entity, result )
    })

    it( 'edit form values', () => {
      const entity = {
        stringField: 'foo',
        numberField: 42,
        booleanField: true
      }

      const expect = {
        stringField: 'bar',
        numberField: -1,
        booleanField: false
      }

      const form = entityModelToForm( document, simpleTypesSchema, entity )

      const stringFieldEl = <HTMLInputElement>strictSelect( form, `[name="${ '/stringField' }"]` )
      stringFieldEl.value = 'bar'

      const numberFieldEl = <HTMLInputElement>strictSelect( form, `[name="${ '/numberField' }"]` )
      numberFieldEl.value = '-1'

      const booleanFieldEl = <HTMLInputElement>strictSelect( form, `[name="${ '/booleanField' }"]` )
      booleanFieldEl.checked = false

      const result = schemaFormToEntityModel( form )

      assert.deepEqual( result, expect )
    })
  })

  describe( 'array', () => {
    it( 'round trips', () => {
      const entity = {
        arrayStringField: [ 'foo', 'bar', 'baz' ]
      }

      const result = roundTrip( entity, simpleArraySchema )

      assert.deepEqual( entity, result )
    })

    it( 'empty array round trips', () => {
      const entity = {
        arrayStringField: []
      }

      const result = roundTrip( entity, simpleArraySchema )

      assert.deepEqual( entity, result )
    })

    describe( 'array of entity', () => {
      it( 'round trips', () => {
        const entity = {
          stringArray: [ 'foo', 'bar' ],
          personArray: []
        }

        const expect = {
          stringArray: [ 'foo', 'bar' ],
          personArray: [
            { entityType: 'Person', entityId: '000000000000000000000001' },
            { entityType: 'Person', entityId: '000000000000000000000002' },
            { entityType: 'Person', entityId: '000000000000000000000003' },
          ]
        }

        const links: ILinkMap = {
          Person: [
            {
              _id: '000000000000000000000001',
              name: 'Bob'
            },
            {
              _id: '000000000000000000000002',
              name: 'Sue'
            },
            {
              _id: '000000000000000000000003',
              name: 'Sally'
            }
          ]
        }

        const schemas = SchemaCollection( [ personSchema, personReferenceSchema, arrayOfEntitySchema ] )
        const schema = <IEntitySchema>schemas.normalize( 'Array of Entities' )
        const linkedSchema = addLinks( schema, links )

        const form = entityModelToForm( document, linkedSchema, entity )
        const api = form[ ArrayifySymbol ][ '/personArray' ]

        for( let i = 0; i < links.Person.length; i++ ){
          const newEl = api.add()
          const select = <HTMLSelectElement>strictSelect( newEl, 'select' )
          select.selectedIndex = i
          console.log( select.value )
        }

        const result = schemaFormToEntityModel( form )

        assert.deepEqual( result, expect )
      })
    })

    describe( 'arrayify api', () => {
      const entity = {
        arrayStringField: [ 'foo', 'bar', 'baz' ]
      }

      it( 'throws when already arrayified', () => {
        const form = entityModelToForm( document, simpleArraySchema, entity )

        assert.throws( () => arrayifySchemaForm( form, h ) )
      })

      it( 'empty array', () => {
        const entity = {
          arrayStringField: []
        }

        const expect = {
          arrayStringField: [ '' ]
        }

        const form = entityModelToForm( document, simpleArraySchema, entity )
        const api = form[ ArrayifySymbol ][ '/arrayStringField' ]
        const newEl = api.add()
        const result = schemaFormToEntityModel( form )

        assert.deepEqual( result, expect )
      })

      it( 'size', () => {
        const form = entityModelToForm( document, simpleArraySchema, entity )
        const api = form[ ArrayifySymbol ][ '/arrayStringField' ]

        assert.strictEqual( api.size(), 3 )
      })

      it( 'add', () => {
        const form = entityModelToForm( document, simpleArraySchema, entity )
        const api = form[ ArrayifySymbol ][ '/arrayStringField' ]

        const newEl = api.add()

        assert.strictEqual( api.size(), 4 )
      })

      it( 'get', () => {
        const form = entityModelToForm( document, simpleArraySchema, entity )
        const api = form[ ArrayifySymbol ][ '/arrayStringField' ]

        const newEl = api.add()

        assert.strictEqual( api.get( 3 ), newEl )
        assert.throws( () => api.get( 4 ) )
      })

      it( 'remove', () => {
        const form = entityModelToForm( document, simpleArraySchema, entity )
        const api = form[ ArrayifySymbol ][ '/arrayStringField' ]
        const expect = {
          arrayStringField: [ 'foo', 'baz' ]
        }

        api.remove( 1 )

        const result = schemaFormToEntityModel( form )

        assert.deepEqual( result ,expect )
        assert.throws( () => api.remove( 3 ) )
      })

      it( 'remove by click', () => {
        const form = entityModelToForm( document, simpleArraySchema, entity )
        const api = form[ ArrayifySymbol ][ '/arrayStringField' ]

        const newEl = api.add()
        const removeButton = <HTMLButtonElement>strictSelect( newEl, 'button[data-action="remove"]' )

        removeButton.click()

        assert.strictEqual( api.size(), 3 )
      })
    })
  })

  describe( 'enum', () => {
    it( 'round trips', () => {
      const entity = {
        enumStringField: 'bar'
      }

      const result = roundTrip( entity, simpleEnumSchema )

      assert.deepEqual( entity, result )
    })

    it( 'set value', () => {
      const entity = {
        enumStringField: 'bar'
      }

      const expect = {
        enumStringField: 'foo'
      }

      const form = entityModelToForm( document, simpleEnumSchema, entity )
      const select = <HTMLSelectElement>strictSelect( form, '[name="/enumStringField"]' )
      const options = <HTMLOptionElement[]>Array.from( select.querySelectorAll( 'option' ) )

      options.forEach( ( option, i ) => {
        option.removeAttribute( 'selected' )
        if( i === 0 ){
          option.setAttribute( 'selected', '' )
        }
      })

      const result = schemaFormToEntityModel( form )

      assert.deepEqual( result, expect )
    })
  })

  describe( 'oneOf', () => {
    it( 'round trips', () => {
      const entity = {
        name: 'foo',
        oneOfField: {
          kind: 'Number',
          value: 42
        }
      }

      const result = roundTrip( entity, simpleOneOfSchema )

      assert.deepEqual( result, entity )
    })

    it( 'change value', () => {
      const entity = {
        name: 'foo',
        oneOfField: {
          kind: 'Number',
          value: 42
        }
      }

      const expect = {
        name: 'foo',
        oneOfField: {
          kind: 'Boolean',
          value: true
        }
      }

      const form = entityModelToForm( document, simpleOneOfSchema, entity )

      const radio = <HTMLInputElement>strictSelect( form, 'input[type="radio"][name="/oneOfField/?"][value="2"]' )
      const input = <HTMLInputElement>strictSelect( form, 'input[name="/oneOfField/?2/value"]' )
      radio.click()
      input.click()

      const result = schemaFormToEntityModel( form )

      assert.deepEqual( result, expect )
    } )
  })

  describe( 'file', () => {
    it( 'round trips with uri', () => {
      const entity = {
        fileField: '/example.png'
      }

      const expect = {
        fileField: '',
        fileField__path: '/example.png'
      }

      const result = roundTrip( entity, simpleFileSchema )

      assert.deepEqual( result, expect )
    })
  })
})