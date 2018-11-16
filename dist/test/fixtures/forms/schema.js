"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleTypesSchema = {
    id: 'http://example.com/schema/simple-types',
    title: 'Simple Types',
    type: 'object',
    format: 'entity-schema',
    properties: {
        stringField: {
            type: 'string',
            title: 'String Field'
        },
        numberField: {
            type: 'number',
            title: 'Number Field'
        },
        booleanField: {
            type: 'boolean',
            title: 'Boolean Field'
        }
    },
    required: ['stringField', 'numberField', 'booleanField'],
    additionalProperties: false
};
exports.simpleArraySchema = {
    id: 'http://example.com/schema/simple-array',
    title: 'Simple Array',
    type: 'object',
    format: 'entity-schema',
    properties: {
        arrayStringField: {
            type: 'array',
            title: 'Array of String Field',
            items: {
                type: 'string',
                title: 'String Field'
            }
        }
    },
    required: ['arrayStringField'],
    additionalProperties: false
};
exports.personSchema = {
    id: 'http://example.com/schema/person',
    title: 'Person',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
        }
    },
    required: ['name'],
    additionalProperties: false
};
exports.personReferenceSchema = {
    id: 'http://example.com/schema/person-reference',
    title: 'Person Reference',
    description: 'A person reference',
    type: 'object',
    properties: {
        entityId: {
            title: 'Person',
            type: 'string',
            pattern: '^[0-9a-f]{24}$',
            message: "Manufacturer must be a 24 character hex string. (0-9, a-f)"
        },
        entityType: {
            title: "Type",
            type: "string",
            enum: ["Person"],
            readOnly: true,
            default: "Person"
        }
    },
    required: ['entityId', 'entityType'],
    additionalProperties: false
};
exports.arrayOfEntitySchema = {
    id: 'http://example.com/schema/array-of-entity',
    title: 'Array of Entities',
    type: 'object',
    format: 'entity-schema',
    properties: {
        stringArray: {
            type: 'array',
            title: 'String Array',
            items: {
                type: 'string',
                title: 'String Item'
            }
        },
        personArray: {
            type: 'array',
            title: 'Person Array',
            items: {
                $ref: 'http://example.com/schema/person-reference'
            }
        }
    },
    required: ['arrayStringField'],
    additionalProperties: false
};
exports.simpleEnumSchema = {
    id: 'http://example.com/schema/simple-enum',
    title: 'Simple Enum',
    type: 'object',
    format: 'entity-schema',
    properties: {
        enumStringField: {
            type: 'string',
            title: 'String Enum',
            enum: ['foo', 'bar', 'baz'],
            _esTitles: ['Foo', 'Bar', 'Baz'],
            message: 'Must be Foo, Bar or Baz'
        }
    },
    required: ['enumStringField'],
    additionalProperties: false
};
exports.simpleOneOfSchema = {
    id: 'http://example.com/schema/simple-one-of',
    title: 'Simple OneOf',
    type: 'object',
    format: 'entity-schema',
    properties: {
        // here to make sure only oneOf fields get transformed
        name: {
            type: 'string',
            title: 'Name'
        },
        oneOfField: {
            type: 'object',
            title: 'One of the following',
            oneOf: [
                {
                    // this is a problem with object-schema maybe? shouldn't be needed
                    id: 'http://example.com/schema/simple-one-of/string-field',
                    title: 'String Field',
                    type: 'object',
                    properties: {
                        kind: {
                            title: 'OneOf Kind',
                            type: 'string',
                            enum: ['String'],
                            default: 'String',
                            readOnly: true
                        },
                        value: {
                            type: 'string',
                            title: 'Value'
                        }
                    },
                    required: ['kind', 'value'],
                    additionalProperties: false
                },
                {
                    id: 'http://example.com/schema/simple-one-of/number-field',
                    title: 'Number Field',
                    type: 'object',
                    properties: {
                        kind: {
                            title: 'OneOf Kind',
                            type: 'string',
                            enum: ['Number'],
                            default: 'Number',
                            readOnly: true
                        },
                        value: {
                            type: 'number',
                            title: 'Value'
                        }
                    },
                    required: ['kind', 'value'],
                    additionalProperties: false
                },
                {
                    id: 'http://example.com/schema/simple-one-of/boolean-field',
                    title: 'Boolean Field',
                    type: 'object',
                    properties: {
                        kind: {
                            title: 'OneOf Kind',
                            type: 'string',
                            enum: ['Boolean'],
                            default: 'Boolean',
                            readOnly: true
                        },
                        value: {
                            type: 'boolean',
                            title: 'Value'
                        }
                    },
                    required: ['kind', 'value'],
                    additionalProperties: false
                },
            ]
        },
    },
    required: ['name', 'oneOfField'],
    additionalProperties: false
};
exports.simpleFileSchema = {
    id: 'http://example.com/schema/simple-file',
    title: 'Simple File',
    type: 'object',
    format: 'entity-schema',
    properties: {
        fileField: {
            title: 'File',
            type: 'string',
            format: 'uri',
            wsUploadable: true,
            wsUploadName: 'file'
        }
    },
    required: ['fileField'],
    additionalProperties: false
};
//# sourceMappingURL=schema.js.map