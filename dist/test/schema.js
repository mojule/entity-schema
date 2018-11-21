"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mongoose = require("mongoose");
const schema_1 = require("./fixtures/schema");
const is_1 = require("@mojule/is");
const __1 = require("..");
const common_schema_1 = require("@entity-schema/common-schema");
const types_1 = require("../security/types");
const filter_schema_for_roles_1 = require("../filter-schema-for-roles");
describe('Schema', () => {
    it('loadSchemas', () => {
        assert.doesNotThrow(() => __1.loadSchemas('./src/test/fixtures/json'));
    });
    describe('Schema Collection Factory arguments', () => {
        it('from schema array', () => {
            const schemas = __1.loadSchemas('./src/test/fixtures/json');
            assert.doesNotThrow(() => {
                __1.SchemaCollection(schemas);
            });
        });
        it('from cache', () => {
            const schemas = __1.loadSchemas('./src/test/fixtures/json');
            const schemas2 = __1.loadSchemas('./src/test/fixtures/json');
            // should refer to the same referential instance if it were loaded from cache
            assert.strictEqual(schemas, schemas2);
        });
        it('no arguments', () => {
            assert.throws(() => __1.SchemaCollection());
        });
        it('bad schema array', () => {
            assert.throws(() => __1.SchemaCollection([{}]));
        });
        // array where the input is so bad it can't even JSON.stringify to create an error message
        it('very bad schema array', () => {
            const circular = {};
            const b = { circular };
            circular.b = b;
            assert.throws(() => __1.SchemaCollection([circular]));
        });
        it('empty schema array', () => {
            assert.throws(() => __1.SchemaCollection([]));
        });
        it('non unique titles', () => {
            assert.throws(() => __1.SchemaCollection([schema_1.validAppSchema, schema_1.validAppSchema]));
        });
    });
    describe('Schema Collection API', () => {
        const schemaCollection = __1.SchemaCollection([schema_1.validAppSchema, schema_1.validEntitySchema, schema_1.entitySchemaWithArray]);
        it('titles', () => {
            const expect = ['valid-app-schema', 'valid-entity-schema', 'entity-schema-array'];
            assert.deepEqual(schemaCollection.titles, expect);
        });
        it('entityTitles', () => {
            assert.deepEqual(schemaCollection.entityTitles, ['valid-entity-schema', 'entity-schema-array']);
        });
        it('enumTitles', () => {
            const schemaCollection = __1.SchemaCollection([schema_1.validAppSchema, schema_1.validEntitySchema, schema_1.entitySchemaWithArray, schema_1.validEnumSchema]);
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
                const schemaCollection = __1.SchemaCollection([schema_1.toMongooseSchema]);
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
                const validErr = valid.validateSync();
                assert(!validErr);
                const invalidErr = invalid.validateSync();
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
            const collection = __1.SchemaCollection([schema_1.validChildSchema, schema_1.validEntitySchema]);
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
            assert.throws(() => __1.SchemaMap([{ type: 'object' }]));
        });
    });
    describe('Subschema Map', () => {
        describe('Reduces subschema to a JSON pointer path -> schema map', () => {
            const schemas = __1.SchemaCollection([schema_1.validAppSchema, schema_1.entitySchemaWithArray, schema_1.validChildSchema, schema_1.validOneOfSchema, schema_1.withOneOf]);
            it('Schema with array', () => {
                const schema = schemas.normalize('entity-schema-array');
                const expect = [
                    '/', '/name', '/abbrev', '/tags', '/tags/[]'
                ];
                const map = __1.subschemaMap(schema);
                const jsonPointerPaths = Object.keys(map);
                assert.deepEqual(jsonPointerPaths, expect);
                assert.deepEqual(map['/'], schema);
            });
            it('Schema with oneOf', () => {
                const schema = schemas.normalize('entity-schema-oneof');
                const expect = [
                    '/', '/name', '/one', '/one/?0', '/one/?1'
                ];
                const map = __1.subschemaMap(schema);
                const jsonPointerPaths = Object.keys(map);
                assert.deepEqual(jsonPointerPaths, expect);
                assert.deepEqual(map['/'], schema);
            });
            it('Child schema', () => {
                const schema = schemas.normalize('valid-child-schema');
                const expect = [
                    '/', '/parent', '/parent/entityId', '/parent/entityType'
                ];
                const map = __1.subschemaMap(schema);
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
                format: 'entity-schema',
                properties: {
                    tags: {
                        title: 'Tags',
                        type: 'array'
                    }
                },
                additionalProperties: false
            };
            const schemaMap = __1.subschemaMap(entitySchema);
            const expect = ['/', '/tags'];
            assert.deepEqual(Object.keys(schemaMap), expect);
        });
        it('Allows entity schema with empty properties', () => {
            const entitySchema = {
                id: "#",
                title: "foo",
                type: 'object',
                format: 'entity-schema',
                properties: {},
                additionalProperties: false
            };
            const schemaMap = __1.subschemaMap(entitySchema);
            const expect = ['/'];
            assert.deepEqual(Object.keys(schemaMap), expect);
        });
        it('Rejects schema with $ref', () => {
            const entitySchema = {
                id: "#",
                title: "foo",
                type: 'object',
                format: 'entity-schema',
                properties: {
                    name: { $ref: 'fail' }
                },
                additionalProperties: false
            };
            assert.throws(() => __1.subschemaMap(entitySchema));
        });
        it('Rejects any schema', () => {
            assert.throws(() => __1.subschemaMap({}));
        });
    });
    describe('Predicates', () => {
        const utils = is_1.Utils(__1.predicates);
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
                                    enum: ["Parent"],
                                    readOnly: true,
                                    default: "Parent"
                                }
                            },
                            required: ["entityId", "entityType"],
                            additionalProperties: false
                        }
                    },
                    _esParentKey: 'parent',
                    additionalProperties: false
                }), 'childEntitySchema');
            });
            it('entitySchema', () => {
                assert.strictEqual(isOf({
                    type: 'object',
                    id: "#",
                    title: "foo",
                    format: 'entity-schema',
                    properties: {},
                    additionalProperties: false
                }), 'entitySchema');
            });
            it('rootSchema', () => {
                assert.strictEqual(isOf({ type: 'object', id: "#", title: "foo" }), 'rootSchema');
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
        const schemas = __1.SchemaCollection([schema_1.validEntitySchemaUniques, schema_1.validAppSchema]);
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
            const withUniques = __1.addUniques(normalized, existingValues);
            assert.deepEqual(withUniques, schema_1.validEntitySchemaUniquesAdded);
        });
        it('Fails with bad existing values map', () => {
            const existingValues = {
                baz: ['foo', 'bar']
            };
            const normalized = schemas.normalize('valid-entity-schema-uniques');
            assert.throws(() => __1.addUniques(normalized, existingValues));
        });
    });
    describe('Entity links', () => {
        const schemas = __1.SchemaCollection([schema_1.validAppSchema, schema_1.validEntitySchema, schema_1.entitySchemaWithLinks]);
        const schema = schemas.normalize('entity-schema-links');
        it('gets link titles', () => {
            const linkTitles = __1.linkTitlesForSchema(schema);
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
            const linkedSchema = __1.addLinks(schema, linkMap);
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
            assert.throws(() => __1.addLinks(schema, badLinkMap));
        });
    });
    describe('Filter Schema for Roles', () => {
        const adminRole = [types_1.Roles.admin];
        const currentUserRole = [types_1.Roles.currentUser];
        const userRole = [types_1.Roles.user];
        const filterSchemaForRoles = filter_schema_for_roles_1.FilterSchemaForRoles(common_schema_1.userSchema);
        it('filters for admin', () => {
            const schema = filterSchemaForRoles(adminRole);
            assert.deepEqual(schema, common_schema_1.userSchema);
        });
        it('filters for currentUser', () => {
            const schema = filterSchemaForRoles(currentUserRole);
            const expect = {
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
                required: ['name', 'email']
            };
            assert.deepEqual(schema, expect);
        });
        it('filters for user', () => {
            const schema = filterSchemaForRoles(userRole);
            assert.strictEqual(JSON.stringify(schema), '{}');
        });
    });
});
//# sourceMappingURL=schema.js.map