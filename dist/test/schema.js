"use strict";
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mongoose = require("mongoose");
const _1 = require("../");
const load_schemas_1 = require("../load-schemas");
const schema_1 = require("./fixtures/schema");
const schema_map_1 = require("../schema-map");
const subschema_map_1 = require("../subschema-map");
const predicates_1 = require("../predicates");
const link_titles_for_schema_1 = require("../link-titles-for-schema");
const add_links_1 = require("../add-links");
const add_uniques_1 = require("../add-uniques");
const is_1 = require("@mojule/is");
describe('Schema', () => {
    it('loadSchemas', () => {
        assert.doesNotThrow(() => load_schemas_1.loadSchemas('./src/test/fixtures/json'));
    });
    describe('Schema Collection Factory arguments', () => {
        it('from schema array', () => {
            const schemas = load_schemas_1.loadSchemas('./src/test/fixtures/json');
            assert.doesNotThrow(() => {
                _1.EntitySchema(schemas);
            });
        });
        it('from cache', () => {
            const schemas = load_schemas_1.loadSchemas('./src/test/fixtures/json');
            const schemas2 = load_schemas_1.loadSchemas('./src/test/fixtures/json');
            // should refer to the same referential instance if it were loaded from cache
            assert.strictEqual(schemas, schemas2);
        });
        it('no arguments', () => {
            assert.throws(() => _1.EntitySchema());
        });
        it('bad schema array', () => {
            assert.throws(() => _1.EntitySchema([{}]));
        });
        // array where the input is so bad it can't even JSON.stringify to create an error message
        it('very bad schema array', () => {
            const circular = {};
            const b = { circular };
            circular.b = b;
            assert.throws(() => _1.EntitySchema([circular]));
        });
        it('empty schema array', () => {
            assert.throws(() => _1.EntitySchema([]));
        });
        it('non unique titles', () => {
            assert.throws(() => _1.EntitySchema([schema_1.validAppSchema, schema_1.validAppSchema]));
        });
    });
    describe('Schema Collection API', () => {
        const schemaCollection = _1.EntitySchema([schema_1.validAppSchema, schema_1.validEntitySchema, schema_1.entitySchemaWithArray]);
        it('titles', () => {
            const expect = ['valid-app-schema', 'valid-entity-schema', 'entity-schema-array'];
            assert.deepEqual(schemaCollection.titles, expect);
        });
        it('entityTitles', () => {
            assert.deepEqual(schemaCollection.entityTitles, ['valid-entity-schema', 'entity-schema-array']);
        });
        it('enumTitles', () => {
            const schemaCollection = _1.EntitySchema([schema_1.validAppSchema, schema_1.validEntitySchema, schema_1.entitySchemaWithArray, schema_1.validEnumSchema]);
            const expect = ['Copyright'];
            assert.deepEqual(schemaCollection.enumTitles, expect);
        });
        it('validator', () => {
            assert(schemaCollection.validator.validate({ name: '' }, schema_1.validEntitySchema));
        });
        it('entities', () => {
            assert.deepEqual(schemaCollection.entities, [schema_1.validEntitySchema, schema_1.entitySchemaWithArray]);
        });
        it('get', () => {
            assert.deepEqual(schemaCollection.get('valid-app-schema'), schema_1.validAppSchema);
            assert.throws(() => schemaCollection.get('bad-title'));
        });
        it('normalize', () => {
            assert.deepEqual(schemaCollection.normalize('valid-entity-schema'), schema_1.normalizedValidEntitySchema);
            assert.throws(() => schemaCollection.normalize('bad-title'));
        });
        it('interfaceSchema', () => {
            assert.deepEqual(schemaCollection.interfaceSchema('valid-entity-schema'), schema_1.validEntitySchemaInterfaceSchema);
            // second time to test retrieving from cache - you can verify this in coverage report
            assert.deepEqual(schemaCollection.interfaceSchema('valid-entity-schema'), schema_1.validEntitySchemaInterfaceSchema);
            assert.throws(() => schemaCollection.interfaceSchema('bad-title'));
        });
        describe('mongooseSchema', () => {
            it('creates from an Entity Schema', () => {
                const mongooseSchema = schemaCollection.mongooseSchema('valid-entity-schema');
                // second time to test retrieving from cache - you can verify this in coverage report
                schemaCollection.mongooseSchema('valid-entity-schema');
            });
            it('bad entity title', () => {
                assert.throws(() => schemaCollection.mongooseSchema('valid-app-schema'));
            });
            it('generated mongoose schema can make a model', () => {
                const mongooseSchema = schemaCollection.mongooseSchema('valid-entity-schema');
                const Entity = mongoose.model('Entity1', mongooseSchema);
                const entity = new Entity({ name: 'Nik' });
                assert.equal(entity.validateSync(), undefined);
            });
            it('fails on missing required', () => {
                const mongooseSchema = schemaCollection.mongooseSchema('valid-entity-schema');
                const Entity = mongoose.model('Entity2', mongooseSchema);
                const noName = new Entity({});
                const noNameErr = noName.validateSync();
                assert(noNameErr && noNameErr.name === 'ValidationError');
            });
            it('fails on minLength', () => {
                const mongooseSchema = schemaCollection.mongooseSchema('valid-entity-schema');
                const Entity = mongoose.model('Entity3', mongooseSchema);
                const tooShortName = new Entity({ name: '' });
                const tooShortNameErr = tooShortName.validateSync();
                assert(tooShortNameErr && tooShortNameErr.name === 'ValidationError');
            });
            it('fails on maxLength', () => {
                const mongooseSchema = schemaCollection.mongooseSchema('valid-entity-schema');
                const Entity = mongoose.model('Entity4', mongooseSchema);
                const tooLongName = new Entity({ name: 'NikJohnCoughlin' });
                const tooLongNameErr = tooLongName.validateSync();
                assert(tooLongNameErr && tooLongNameErr.name === 'ValidationError');
            });
            it('fails on pattern', () => {
                const mongooseSchema = schemaCollection.mongooseSchema('valid-entity-schema');
                const Entity = mongoose.model('Entity5', mongooseSchema);
                const badPattern = new Entity({ name: 'Nik 1' });
                const badPatternErr = badPattern.validateSync();
                assert(badPatternErr && badPatternErr.name === 'ValidationError');
            });
            it('complex schema', () => {
                const schemaCollection = _1.EntitySchema([schema_1.toMongooseSchema]);
                const mongooseSchema = schemaCollection.mongooseSchema('mongoose-schema');
                const Entity = mongoose.model('Entity6', mongooseSchema);
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
                });
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
                });
                const invalidErr = valid.validateSync();
                assert(invalidErr && invalidErr.name === 'ValidationError');
            });
        });
        describe('filterEntity', () => {
            it('filters additional properties', () => {
                const before = {
                    name: 'Nik',
                    age: 37,
                    abbrev: 'nc',
                    tags: ['foo', 'bar'],
                    blags: ['bar', 'baz']
                };
                const expect = {
                    name: 'Nik',
                    abbrev: 'nc',
                    tags: ['foo', 'bar']
                };
                const after = schemaCollection.filterEntity('entity-schema-array', before);
                assert.deepEqual(after, expect);
            });
        });
        describe('parent', () => {
            const collection = _1.EntitySchema([schema_1.validChildSchema, schema_1.validEntitySchema]);
            it('parent', () => {
                assert.strictEqual(collection.parent('valid-child-schema'), 'Parent');
            });
            it('parent is undefined', () => {
                assert.strictEqual(collection.parent('valid-entity-schema'), undefined);
            });
            it('parentProperty', () => {
                assert.strictEqual(collection.parentProperty('valid-child-schema'), 'parent');
            });
            it('parentProperty is undefined', () => {
                assert.strictEqual(collection.parentProperty('valid-entity-schema'), undefined);
            });
        });
    });
    describe('SchemaMap', () => {
        it('Schema with no id', () => {
            assert.throws(() => schema_map_1.SchemaMap([{ type: 'object' }]));
        });
    });
    describe('Subschema Map', () => {
        describe('Reduces subschema to a JSON pointer path -> schema map', () => {
            const schemas = _1.EntitySchema([schema_1.validAppSchema, schema_1.entitySchemaWithArray, schema_1.validChildSchema, schema_1.validOneOfSchema, schema_1.withOneOf]);
            it('Schema with array', () => {
                const schema = schemas.normalize('entity-schema-array');
                const expect = [
                    '/', '/name', '/abbrev', '/tags', '/tags/[]'
                ];
                const map = subschema_map_1.subschemaMap(schema);
                const jsonPointerPaths = Object.keys(map);
                assert.deepEqual(jsonPointerPaths, expect);
                assert.deepEqual(map['/'], schema);
            });
            it('Schema with oneOf', () => {
                const schema = schemas.normalize('entity-schema-oneof');
                const expect = [
                    '/', '/name', '/one', '/one/?0', '/one/?1'
                ];
                const map = subschema_map_1.subschemaMap(schema);
                const jsonPointerPaths = Object.keys(map);
                assert.deepEqual(jsonPointerPaths, expect);
                assert.deepEqual(map['/'], schema);
            });
            it('Child schema', () => {
                const schema = schemas.normalize('valid-child-schema');
                const expect = [
                    '/', '/parent', '/parent/entityId', '/parent/entityType'
                ];
                const map = subschema_map_1.subschemaMap(schema);
                const jsonPointerPaths = Object.keys(map);
                assert.deepEqual(jsonPointerPaths, expect);
                assert.deepEqual(map['/'], schema);
            });
        });
        it('Allows array schema with no items definition', () => {
            const entitySchema = {
                id: "#",
                title: "foo",
                type: 'object',
                format: 'workingspec-entity',
                properties: {
                    tags: {
                        title: 'Tags',
                        type: 'array'
                    }
                },
                additionalProperties: false
            };
            const schemaMap = subschema_map_1.subschemaMap(entitySchema);
            const expect = ['/', '/tags'];
            assert.deepEqual(Object.keys(schemaMap), expect);
        });
        it('Allows entity schema with empty properties', () => {
            const entitySchema = {
                id: "#",
                title: "foo",
                type: 'object',
                format: 'workingspec-entity',
                properties: {},
                additionalProperties: false
            };
            const schemaMap = subschema_map_1.subschemaMap(entitySchema);
            const expect = ['/'];
            assert.deepEqual(Object.keys(schemaMap), expect);
        });
        it('Rejects schema with $ref', () => {
            const entitySchema = {
                id: "#",
                title: "foo",
                type: 'object',
                format: 'workingspec-entity',
                properties: {
                    name: { $ref: 'fail' }
                },
                additionalProperties: false
            };
            assert.throws(() => subschema_map_1.subschemaMap(entitySchema));
        });
        it('Rejects any schema', () => {
            assert.throws(() => subschema_map_1.subschemaMap({}));
        });
    });
    describe('Predicates', () => {
        const utils = is_1.Utils(predicates_1.predicates);
        const isOf = utils.of;
        describe('Schema types', () => {
            it('anySchema', () => {
                assert.strictEqual(isOf({}), 'anySchema');
            });
            it('stringSchema', () => {
                assert.strictEqual(isOf({ type: 'string' }), 'stringSchema');
            });
            it('numberSchema', () => {
                assert.strictEqual(isOf({ type: 'number' }), 'numberSchema');
            });
            it('booleanSchema', () => {
                assert.strictEqual(isOf({ type: 'boolean' }), 'booleanSchema');
            });
            it('arraySchema', () => {
                assert.strictEqual(isOf({ type: 'array' }), 'arraySchema');
            });
            it('childEntitySchema', () => {
                assert.strictEqual(isOf({
                    type: 'object',
                    id: "#",
                    title: "foo",
                    format: 'workingspec-entity',
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
                                    enum: ["Parent"],
                                    readOnly: true,
                                    default: "Parent"
                                }
                            },
                            required: ["entityId", "entityType"],
                            additionalProperties: false
                        }
                    },
                    wsParentProperty: 'parent',
                    additionalProperties: false
                }), 'childEntitySchema');
            });
            it('entitySchema', () => {
                assert.strictEqual(isOf({
                    type: 'object',
                    id: "#",
                    title: "foo",
                    format: 'workingspec-entity',
                    properties: {},
                    additionalProperties: false
                }), 'entitySchema');
            });
            it('appSchema', () => {
                assert.strictEqual(isOf({ type: 'object', id: "#", title: "foo" }), 'appSchema');
            });
            it('objectSchema', () => {
                assert.strictEqual(isOf({ type: 'object', id: "#", title: "foo", properties: {}, additionalProperties: false }), 'objectSchema');
            });
            it('oneOfSchema', () => {
                assert.strictEqual(isOf({
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
                }), 'oneOfSchema');
            });
        });
    });
    describe('Unique properties', () => {
        const schemas = _1.EntitySchema([schema_1.validEntitySchemaUniques, schema_1.validAppSchema]);
        it('Gets unique property names for a schema', () => {
            const expect = ['abbrev'];
            const uniqueNames = schemas.uniquePropertyNames('valid-entity-schema-uniques');
            assert.deepEqual(uniqueNames, expect);
        });
        it('Gets a schema with uniques added as enum', () => {
            const existingValues = {
                abbrev: ['foo', 'bar']
            };
            const normalized = schemas.normalize('valid-entity-schema-uniques');
            const withUniques = add_uniques_1.addUniques(normalized, existingValues);
            assert.deepEqual(withUniques, schema_1.validEntitySchemaUniquesAdded);
        });
        it('Fails with bad existing values map', () => {
            const existingValues = {
                baz: ['foo', 'bar']
            };
            const normalized = schemas.normalize('valid-entity-schema-uniques');
            assert.throws(() => add_uniques_1.addUniques(normalized, existingValues));
        });
    });
    describe('Entity links', () => {
        const schemas = _1.EntitySchema([schema_1.validAppSchema, schema_1.validEntitySchema, schema_1.entitySchemaWithLinks]);
        const schema = schemas.normalize('entity-schema-links');
        it('gets link titles', () => {
            const linkTitles = link_titles_for_schema_1.linkTitlesForSchema(schema);
            const expect = ['valid-entity-schema'];
            assert.deepEqual(linkTitles, expect);
        });
        it('gets a schema with links added', () => {
            const linkMap = {
                'valid-entity-schema': [
                    {
                        _id: 'foo',
                        name: 'Foo'
                    }
                ]
            };
            const linkedSchema = add_links_1.addLinks(schema, linkMap);
            assert.deepEqual(linkedSchema, schema_1.entitySchemaWithLinksAdded);
        });
        it('fails on bad link map', () => {
            const badLinkMap = {
                'blah': [
                    {
                        _id: 'foo',
                        name: 'Foo'
                    }
                ]
            };
            assert.throws(() => add_links_1.addLinks(schema, badLinkMap));
        });
    });
});
//# sourceMappingURL=schema.js.map