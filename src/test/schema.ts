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

import { Utils } from '@mojule/is'
import { IExistingValuesMap } from '../add-uniques'
import { ILinkMap } from '../add-links'

import {
  SchemaCollection, loadSchemas, SchemaMap, subschemaMap, predicates,
  addUniques, linkTitlesForSchema, addLinks
} from '..'
import { userSchema } from '@entity-schema/common-schema'
import { Roles } from '../security/types'
import { FilterSchemaForRoles } from '../filter-schema-for-roles'
import { RootSchema, EntitySchema } from '@entity-schema/predicates'

describe( 'Schema', () => {
  it( 'loadSchemas', () => {
    assert.doesNotThrow( () => <RootSchema[]>loadSchemas( './src/test/fixtures/json' ) )
  })

  describe( 'Schema Collection Factory arguments', () => {
    it( 'from schema array', () => {
      const schemas = <RootSchema[]>loadSchemas( './src/test/fixtures/json' )

      assert.doesNotThrow( () => {
        SchemaCollection( schemas )
      })
    })

    it( 'from cache', () => {
      const schemas = <RootSchema[]>loadSchemas( './src/test/fixtures/json' )
      const schemas2 = <RootSchema[]>loadSchemas( './src/test/fixtures/json' )

      // should refer to the same referential instance if it were loaded from cache
      assert.strictEqual( schemas, schemas2 )
    })

    it( 'no arguments', () => {
      assert.throws( () => ( <any>SchemaCollection )() )
    })

    it( 'bad schema array', () => {
      assert.throws( () => ( <any>SchemaCollection )( [{}] ) )
    })

    // array where the input is so bad it can't even JSON.stringify to create an error message
    it( 'very bad schema array', () => {
      const circular : any = {}
      const b = { circular }

      circular.b = b

      assert.throws( () => ( <any>SchemaCollection )( [circular] ) )
    })

    it( 'empty schema array', () => {
      assert.throws( () => SchemaCollection( [] ) )
    })

    it( 'non unique titles', () => {
      assert.throws( () => SchemaCollection( [ validAppSchema, validAppSchema ] ) )
    })
  })

  describe( 'Schema Collection API', () => {
    const schemaCollection = SchemaCollection( [ validAppSchema, validEntitySchema, entitySchemaWithArray ] )

    it( 'titles', () => {
      const expect = [ 'valid-app-schema', 'valid-entity-schema', 'entity-schema-array' ]

      assert.deepEqual( schemaCollection.titles, expect )
    })

    it( 'entityTitles', () => {
      assert.deepEqual( schemaCollection.entityTitles, [ 'valid-entity-schema', 'entity-schema-array' ] )
    })

    it( 'enumTitles', () => {
      const schemaCollection = SchemaCollection( [ validAppSchema, validEntitySchema, entitySchemaWithArray, validEnumSchema ] )

      const expect = [ 'Copyright' ]

      assert.deepEqual( schemaCollection.enumTitles, expect )
    })

    it( 'validator', () => {
      assert( schemaCollection.validator.validate( { name: '' }, <tv4.JsonSchema>validEntitySchema ) )
    })

    it( 'entities', () => {
      assert.deepEqual( schemaCollection.entities, [ validEntitySchema, entitySchemaWithArray ] )
    })

    it( 'get', () => {
      assert.deepEqual( schemaCollection.get( 'valid-app-schema' ), validAppSchema )
      assert.throws( () => schemaCollection.get( 'bad-title' ) )
    })

    it( 'normalize', () => {
      assert.deepEqual( schemaCollection.normalize( 'valid-entity-schema' ), normalizedValidEntitySchema )
      assert.throws( () => schemaCollection.normalize( 'bad-title' ) )
    })

    it( 'interfaceSchema', () => {
      assert.deepEqual( schemaCollection.interfaceSchema( 'valid-entity-schema' ), validEntitySchemaInterfaceSchema )

      // second time to test retrieving from cache - you can verify this in coverage report
      assert.deepEqual( schemaCollection.interfaceSchema( 'valid-entity-schema' ), validEntitySchemaInterfaceSchema )

      assert.throws( () => schemaCollection.interfaceSchema( 'bad-title' ) )
    })

    describe( 'mongooseSchema', () => {
      it( 'creates from an Entity Schema', () => {
        // second time to test retrieving from cache - you can verify this in coverage report
        schemaCollection.mongooseSchema( 'valid-entity-schema' )
      })

      it( 'bad entity title', () => {
        assert.throws( () => schemaCollection.mongooseSchema( 'valid-app-schema' ) )
      })

      it( 'generated mongoose schema can make a model', () => {
        const mongooseSchema = schemaCollection.mongooseSchema( 'valid-entity-schema' )

        const Entity = mongoose.model( 'Entity1', mongooseSchema )

        const entity = new Entity({ name: 'Nik' })
        assert.equal( entity.validateSync(), undefined )
      })

      it( 'fails on missing required', () => {
        const mongooseSchema = schemaCollection.mongooseSchema( 'valid-entity-schema' )

        const Entity = mongoose.model( 'Entity2', mongooseSchema )

        const noName = new Entity({})
        const noNameErr = <any>noName.validateSync()
        assert( noNameErr && noNameErr.name === 'ValidationError' )
      })

      it( 'fails on minLength',  () => {
        const mongooseSchema = schemaCollection.mongooseSchema( 'valid-entity-schema' )

        const Entity = mongoose.model( 'Entity3', mongooseSchema )

        const tooShortName = new Entity({ name: '' })
        const tooShortNameErr = <any>tooShortName.validateSync()
        assert( tooShortNameErr && tooShortNameErr.name === 'ValidationError' )
      })

      it( 'fails on maxLength',  () => {
        const mongooseSchema = schemaCollection.mongooseSchema( 'valid-entity-schema' )

        const Entity = mongoose.model( 'Entity4', mongooseSchema )

        const tooLongName = new Entity({ name: 'NikJohnCoughlin' })
        const tooLongNameErr = <any>tooLongName.validateSync()
        assert( tooLongNameErr && tooLongNameErr.name === 'ValidationError' )
      })

      it( 'fails on pattern',  () => {
        const mongooseSchema = schemaCollection.mongooseSchema( 'valid-entity-schema' )

        const Entity = mongoose.model( 'Entity5', mongooseSchema )

        const badPattern = new Entity({ name: 'Nik 1' })
        const badPatternErr = <any>badPattern.validateSync()
        assert( badPatternErr && badPatternErr.name === 'ValidationError' )
      })

      it( 'complex schema', () => {
        const schemaCollection = SchemaCollection( [ toMongooseSchema ] )
        const mongooseSchema = schemaCollection.mongooseSchema( 'mongoose-schema' )

        const Entity = mongoose.model( 'Entity6', mongooseSchema )

        const valid = new Entity({
          minLengthStr: 'a',
          maxLengthStr: 'aaaaa',
          minAndMaxLengthStr: 'aaa',
          patternStr: 'abc',
          booleanProp: true,
          objectProp: {},
          numberProp: 0,
          arrayProp: [],
          nullProp: null,
          anyProp: {}
        })

        const invalid = new Entity({
          minLengthStr: '',
          maxLengthStr: 'aaaaaa',
          minAndMaxLengthStr: 'aaaaaa',
          patternStr: '0',
          booleanProp: null,
          objectProp: [],
          numberProp: 'a',
          arrayProp: {},
          nullProp: true
        })

        const validErr = <any>valid.validateSync()
        assert( !validErr )

        const invalidErr = <any>invalid.validateSync()
        assert( invalidErr && invalidErr.name === 'ValidationError' )
      })
    })

    describe( 'filterEntity', () => {
      it( 'filters additional properties', () => {
        const before = {
          name: 'Nik',
          age: 37,
          abbrev: 'nc',
          tags: [ 'foo', 'bar' ],
          blags: [ 'bar', 'baz' ]
        }

        const expect = {
          name: 'Nik',
          abbrev: 'nc',
          tags: [ 'foo', 'bar' ]
        }

        const after = schemaCollection.filterEntity( 'entity-schema-array', before )

        assert.deepEqual( after, expect )
      })
    })

    describe( 'parent', () => {
      const collection = SchemaCollection( [ validChildSchema, validEntitySchema ] )

      it( 'parent', () => {
        assert.strictEqual( collection.parent( 'valid-child-schema' ), 'Parent' )
      })

      it( 'parent is undefined', () => {
        assert.strictEqual( collection.parent( 'valid-entity-schema' ), undefined )
      })

      it( 'parentProperty', () => {
        assert.strictEqual( collection.parentProperty( 'valid-child-schema' ), 'parent' )
      })

      it( 'parentProperty is undefined', () => {
        assert.strictEqual( collection.parentProperty( 'valid-entity-schema' ), undefined )
      })
    })
  })

  describe( 'SchemaMap', () => {
    it( 'Schema with no id', () => {
      assert.throws( () => SchemaMap( [ { type: 'object' }] ))
    })
  })

  describe( 'Subschema Map', () => {
    describe( 'Reduces subschema to a JSON pointer path -> schema map', () => {
      const schemas = SchemaCollection( [ validAppSchema, entitySchemaWithArray, validChildSchema, validOneOfSchema, withOneOf ] )

      it( 'Schema with array', () => {
        const schema = <EntitySchema>schemas.normalize( 'entity-schema-array' )

        const expect = [
          '/', '/name', '/abbrev', '/tags', '/tags/[]'
        ]

        const map = subschemaMap( schema )
        const jsonPointerPaths = Object.keys( map )

        assert.deepEqual( jsonPointerPaths, expect )
        assert.deepEqual( map[ '/' ], schema )
      })

      it( 'Schema with oneOf', () => {
        const schema = <EntitySchema>schemas.normalize( 'entity-schema-oneof' )

        const expect = [
          '/', '/name', '/one', '/one/?0', '/one/?1'
        ]

        const map = subschemaMap( schema )
        const jsonPointerPaths = Object.keys( map )

        assert.deepEqual( jsonPointerPaths, expect )
        assert.deepEqual( map[ '/' ], schema )
      })

      it( 'Child schema', () => {
        const schema = <EntitySchema>schemas.normalize( 'valid-child-schema' )

        const expect = [
          '/', '/parent', '/parent/entityId', '/parent/entityType'
        ]

        const map = subschemaMap( schema )
        const jsonPointerPaths = Object.keys( map )

        assert.deepEqual( jsonPointerPaths, expect )
        assert.deepEqual( map[ '/' ], schema )
      })
    })

    it( 'Allows array schema with no items definition', () => {
      const entitySchema : EntitySchema = {
        id: "#",
        title: "foo",
        type: 'object',
        format: 'entity-schema',
        properties: {
          tags: {
            title: 'Tags',
            type: 'array'
          }
        },
        additionalProperties: false
      }

      const schemaMap = subschemaMap( entitySchema )

      const expect = [ '/', '/tags' ]

      assert.deepEqual( Object.keys( schemaMap ), expect )
    })

    it( 'Allows entity schema with empty properties', () => {
      const entitySchema : EntitySchema = {
        id: "#",
        title: "foo",
        type: 'object',
        format: 'entity-schema',
        properties: {},
        additionalProperties: false
      }

      const schemaMap = subschemaMap( entitySchema )

      const expect = [ '/' ]

      assert.deepEqual( Object.keys( schemaMap ), expect )
    })

    it( 'Rejects schema with $ref', () => {
      const entitySchema : EntitySchema = {
        id: "#",
        title: "foo",
        type: 'object',
        format: 'entity-schema',
        properties: {
          name: { $ref: 'fail' }
        },
        additionalProperties: false
      }

      assert.throws( () => subschemaMap( entitySchema ) )
    })

    it( 'Rejects any schema', () => {
      assert.throws( () => subschemaMap( <any>{} ) )
    })
  })

  describe( 'Predicates', () => {
    const utils = Utils( predicates )
    const isOf = utils.of

    describe( 'Schema types', () => {
      it( 'anySchema', () => {
        assert.strictEqual( isOf( {} ), 'anySchema'  )
      })

      it( 'stringSchema', () => {
        assert.strictEqual( isOf( { type: 'string' } ), 'stringSchema' )
      })

      it( 'numberSchema', () => {
        assert.strictEqual( isOf( { type: 'number' } ), 'numberSchema' )
      })

      it( 'booleanSchema', () => {
        assert.strictEqual( isOf( { type: 'boolean' } ), 'booleanSchema' )
      })

      it( 'arraySchema', () => {
        assert.strictEqual( isOf( { type: 'array' } ), 'arraySchema' )
      })

      it( 'childEntitySchema', () => {
        assert.strictEqual(
          isOf(
            {
              type: 'object',
              id: "#",
              title: "foo",
              format: 'entity-schema',
              properties: {
                parent: {
                  title: "Parent",
                  type: "object",
                  properties: {
                    entityId: {
                      title: "Parent",
                      type: "string",
                      pattern: "^[0-9a-f]{24}$",
                      message: "Parent must be a 24 character hex string. (0-9, a-f)"
                    },
                    entityType: {
                      title: "Entity Type",
                      type: "string",
                      enum: [ "Parent" ],
                      readOnly: true,
                      default: "Parent"
                    }
                  },
                  required: [ "entityId", "entityType" ],
                  additionalProperties: false
                }
              },
              _esParentKey: 'parent',
              additionalProperties: false
            }
          ),
          'childEntitySchema'
        )
      })

      it( 'entitySchema', () => {
        assert.strictEqual(
          isOf(
            {
              type: 'object',
              id: "#",
              title: "foo",
              format: 'entity-schema',
              properties: {},
              additionalProperties: false
            }
          ),
          'entitySchema'
        )
      })

      it( 'rootSchema', () => {
        assert.strictEqual( isOf( { type: 'object', id: "#", title: "foo" } ), 'rootSchema' )
      })

      it( 'objectSchema', () => {
        assert.strictEqual( isOf( { type: 'object', id: "#", title: "foo", properties: {}, additionalProperties: false } ), 'objectSchema' )
      })

      it( 'oneOfSchema', () => {
        assert.strictEqual(
          isOf(
            {
              title: "Payload",
              type: "object",
              oneOf: [
                {
                  $ref: "http://workingspec.com/schema/document-payload-generic"
                },
                {
                  $ref: "http://workingspec.com/schema/document-payload-unity"
                }
              ]
            }
          ),
          'oneOfSchema'
        )
      })
    })
  })

  describe( 'Unique properties', () => {
    const schemas = SchemaCollection( [ validEntitySchemaUniques, validAppSchema ] )

    it( 'Gets unique property names for a schema', () => {
      const expect = [ 'abbrev' ]

      const uniqueNames = schemas.uniquePropertyNames( 'valid-entity-schema-uniques' )

      assert.deepEqual( uniqueNames, expect )
    })

    it( 'Gets a schema with uniques added as enum', () => {
      const existingValues : IExistingValuesMap = {
        abbrev: [ 'foo', 'bar' ]
      }

      const normalized = <EntitySchema>schemas.normalize( 'valid-entity-schema-uniques' )

      const withUniques = addUniques( normalized, existingValues )

      assert.deepEqual( withUniques, validEntitySchemaUniquesAdded )
    })

    it( 'Fails with bad existing values map', () => {
      const existingValues : IExistingValuesMap = {
        baz: [ 'foo', 'bar' ]
      }

      const normalized = <EntitySchema>schemas.normalize( 'valid-entity-schema-uniques' )

      assert.throws( () => addUniques( normalized, existingValues ) )
    })
  })

  describe( 'Entity links', () => {
    const schemas = SchemaCollection( [ validAppSchema, validEntitySchema, entitySchemaWithLinks ])
    const schema = <EntitySchema>schemas.normalize( 'entity-schema-links' )

    it( 'gets link titles', () => {
      const linkTitles = linkTitlesForSchema( schema )

      const expect = [ 'valid-entity-schema' ]

      assert.deepEqual( linkTitles, expect )
    })

    it( 'gets a schema with links added', () => {
      const linkMap: ILinkMap = {
        'valid-entity-schema': [
          {
            _id: 'foo',
            name: 'Foo'
          }
        ]
      }

      const linkedSchema = addLinks( schema, linkMap )

      assert.deepEqual( linkedSchema, entitySchemaWithLinksAdded )
    })

    it( 'fails on bad link map', () => {
      const badLinkMap: ILinkMap = {
        'blah': [
          {
            _id: 'foo',
            name: 'Foo'
          }
        ]
      }

      assert.throws( () => addLinks( schema, badLinkMap ) )
    })
  })

  describe( 'Filter Schema for Roles', () => {
    const adminRole = [ Roles.admin ]
    const currentUserRole = [ Roles.currentUser ]
    const userRole = [ Roles.user ]
    const filterSchemaForRoles = FilterSchemaForRoles( userSchema )

    it( 'filters for admin', () => {
      const schema = filterSchemaForRoles( adminRole )

      assert.deepEqual( schema, userSchema )
    })

    it( 'filters for currentUser', () => {
      const schema = filterSchemaForRoles( currentUserRole )

      const expect: EntitySchema = {
        id: 'http://workingspec.com/schema/user',
        title: 'User',
        description: 'Person with access to the system',
        type: 'object',
        format: 'entity-schema',
        properties: {
          name: {
            title: 'Name',
            description: 'The user\'s name',
            type: 'string'
          },
          email: {
            title: 'Email',
            description: 'The user\'s email address',
            type: 'string',
            format: 'email'
          }
        },
        additionalProperties: false,
        required: [ 'name', 'email' ]
      }

      assert.deepEqual( schema, expect )
    })

    it( 'filters for user', () => {
      const schema = filterSchemaForRoles( userRole )

      assert.strictEqual( JSON.stringify( schema ), '{}' )
    } )
  })
})
