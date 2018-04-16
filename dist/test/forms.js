"use strict";
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const doc = require("@mojule/document");
const entity_model_to_form_1 = require("../forms/entity-model-to-form");
const schema_form_to_entity_model_1 = require("../forms/schema-form-to-entity-model");
const schema_1 = require("./fixtures/forms/schema");
const dom_utils_1 = require("@mojule/dom-utils");
const __1 = require("..");
const H = require("@mojule/h");
const add_links_1 = require("../add-links");
const document = doc;
const h = H(document);
const roundTrip = (entityModel, schema) => {
    const form = entity_model_to_form_1.entityModelToForm(document, schema, entityModel);
    const model = schema_form_to_entity_model_1.schemaFormToEntityModel(form);
    return model;
};
describe('forms', () => {
    describe('simple types', () => {
        it('round trips', () => {
            const entity = {
                stringField: 'foo',
                numberField: 42,
                booleanField: true
            };
            const result = roundTrip(entity, schema_1.simpleTypesSchema);
            assert.deepEqual(entity, result);
        });
        it('edit form values', () => {
            const entity = {
                stringField: 'foo',
                numberField: 42,
                booleanField: true
            };
            const expect = {
                stringField: 'bar',
                numberField: -1,
                booleanField: false
            };
            const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleTypesSchema, entity);
            const stringFieldEl = dom_utils_1.strictSelect(form, `[name="${'/stringField'}"]`);
            stringFieldEl.value = 'bar';
            const numberFieldEl = dom_utils_1.strictSelect(form, `[name="${'/numberField'}"]`);
            numberFieldEl.value = '-1';
            const booleanFieldEl = dom_utils_1.strictSelect(form, `[name="${'/booleanField'}"]`);
            booleanFieldEl.checked = false;
            const result = schema_form_to_entity_model_1.schemaFormToEntityModel(form);
            assert.deepEqual(result, expect);
        });
    });
    describe('array', () => {
        it('round trips', () => {
            const entity = {
                arrayStringField: ['foo', 'bar', 'baz']
            };
            const result = roundTrip(entity, schema_1.simpleArraySchema);
            assert.deepEqual(entity, result);
        });
        it('empty array round trips', () => {
            const entity = {
                arrayStringField: []
            };
            const result = roundTrip(entity, schema_1.simpleArraySchema);
            assert.deepEqual(entity, result);
        });
        describe('array of entity', () => {
            it('round trips', () => {
                const entity = {
                    stringArray: ['foo', 'bar'],
                    personArray: []
                };
                const expect = {
                    stringArray: ['foo', 'bar'],
                    personArray: [
                        { entityType: 'Person', entityId: '000000000000000000000001' },
                        { entityType: 'Person', entityId: '000000000000000000000002' },
                        { entityType: 'Person', entityId: '000000000000000000000003' },
                    ]
                };
                const links = {
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
                };
                const schemas = __1.SchemaCollection([schema_1.personSchema, schema_1.personReferenceSchema, schema_1.arrayOfEntitySchema]);
                const schema = schemas.normalize('Array of Entities');
                const linkedSchema = add_links_1.addLinks(schema, links);
                const form = entity_model_to_form_1.entityModelToForm(document, linkedSchema, entity);
                const api = form[__1.ArrayifySymbol]['/personArray'];
                for (let i = 0; i < links.Person.length; i++) {
                    const newEl = api.add();
                    const select = dom_utils_1.strictSelect(newEl, 'select');
                    select.selectedIndex = i;
                    console.log(select.value);
                }
                const result = schema_form_to_entity_model_1.schemaFormToEntityModel(form);
                assert.deepEqual(result, expect);
            });
        });
        describe('arrayify api', () => {
            const entity = {
                arrayStringField: ['foo', 'bar', 'baz']
            };
            it('throws when already arrayified', () => {
                const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleArraySchema, entity);
                assert.throws(() => __1.arrayifySchemaForm(form, h));
            });
            it('empty array', () => {
                const entity = {
                    arrayStringField: []
                };
                const expect = {
                    arrayStringField: ['']
                };
                const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleArraySchema, entity);
                const api = form[__1.ArrayifySymbol]['/arrayStringField'];
                const newEl = api.add();
                const result = schema_form_to_entity_model_1.schemaFormToEntityModel(form);
                assert.deepEqual(result, expect);
            });
            it('size', () => {
                const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleArraySchema, entity);
                const api = form[__1.ArrayifySymbol]['/arrayStringField'];
                assert.strictEqual(api.size(), 3);
            });
            it('add', () => {
                const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleArraySchema, entity);
                const api = form[__1.ArrayifySymbol]['/arrayStringField'];
                const newEl = api.add();
                assert.strictEqual(api.size(), 4);
            });
            it('get', () => {
                const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleArraySchema, entity);
                const api = form[__1.ArrayifySymbol]['/arrayStringField'];
                const newEl = api.add();
                assert.strictEqual(api.get(3), newEl);
                assert.throws(() => api.get(4));
            });
            it('remove', () => {
                const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleArraySchema, entity);
                const api = form[__1.ArrayifySymbol]['/arrayStringField'];
                const expect = {
                    arrayStringField: ['foo', 'baz']
                };
                api.remove(1);
                const result = schema_form_to_entity_model_1.schemaFormToEntityModel(form);
                assert.deepEqual(result, expect);
                assert.throws(() => api.remove(3));
            });
            it('remove by click', () => {
                const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleArraySchema, entity);
                const api = form[__1.ArrayifySymbol]['/arrayStringField'];
                const newEl = api.add();
                const removeButton = dom_utils_1.strictSelect(newEl, 'button[data-action="remove"]');
                removeButton.click();
                assert.strictEqual(api.size(), 3);
            });
        });
    });
    describe('enum', () => {
        it('round trips', () => {
            const entity = {
                enumStringField: 'bar'
            };
            const result = roundTrip(entity, schema_1.simpleEnumSchema);
            assert.deepEqual(entity, result);
        });
        it('set value', () => {
            const entity = {
                enumStringField: 'bar'
            };
            const expect = {
                enumStringField: 'foo'
            };
            const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleEnumSchema, entity);
            const select = dom_utils_1.strictSelect(form, '[name="/enumStringField"]');
            const options = Array.from(select.querySelectorAll('option'));
            options.forEach((option, i) => {
                option.removeAttribute('selected');
                if (i === 0) {
                    option.setAttribute('selected', '');
                }
            });
            const result = schema_form_to_entity_model_1.schemaFormToEntityModel(form);
            assert.deepEqual(result, expect);
        });
    });
    describe('oneOf', () => {
        it('round trips', () => {
            const entity = {
                name: 'foo',
                oneOfField: {
                    kind: 'Number',
                    value: 42
                }
            };
            const result = roundTrip(entity, schema_1.simpleOneOfSchema);
            assert.deepEqual(result, entity);
        });
        it('change value', () => {
            const entity = {
                name: 'foo',
                oneOfField: {
                    kind: 'Number',
                    value: 42
                }
            };
            const expect = {
                name: 'foo',
                oneOfField: {
                    kind: 'Boolean',
                    value: true
                }
            };
            const form = entity_model_to_form_1.entityModelToForm(document, schema_1.simpleOneOfSchema, entity);
            const radio = dom_utils_1.strictSelect(form, 'input[type="radio"][name="/oneOfField/?"][value="2"]');
            const input = dom_utils_1.strictSelect(form, 'input[name="/oneOfField/?2/value"]');
            radio.click();
            input.click();
            const result = schema_form_to_entity_model_1.schemaFormToEntityModel(form);
            assert.deepEqual(result, expect);
        });
    });
    describe('file', () => {
        it('round trips with uri', () => {
            const entity = {
                fileField: '/example.png'
            };
            const expect = {
                fileField: '',
                fileField__path: '/example.png'
            };
            const result = roundTrip(entity, schema_1.simpleFileSchema);
            assert.deepEqual(result, expect);
        });
    });
});
//# sourceMappingURL=forms.js.map