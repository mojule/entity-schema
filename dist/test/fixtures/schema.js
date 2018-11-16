"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validAppSchema = {
    id: 'http://example.com/schema/valid-app-schema',
    title: 'valid-app-schema',
    type: 'string',
    minLength: 1,
    maxLength: 10,
    pattern: '^[A-Za-z]+$'
};
exports.validEntitySchema = {
    id: 'http://example.com/schema/valid-entity-schema',
    title: 'valid-entity-schema',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            $ref: 'http://example.com/schema/valid-app-schema'
        }
    },
    required: ['name'],
    additionalProperties: false
};
exports.normalizedValidEntitySchema = {
    id: 'http://example.com/schema/valid-entity-schema',
    title: 'valid-entity-schema',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            id: 'http://example.com/schema/valid-app-schema',
            title: 'valid-app-schema',
            type: 'string',
            minLength: 1,
            maxLength: 10,
            pattern: '^[A-Za-z]+$'
        }
    },
    required: ['name'],
    additionalProperties: false
};
exports.validEntitySchemaInterfaceSchema = {
    title: 'IValidEntitySchema',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 10,
            pattern: '^[A-Za-z]+$'
        }
    },
    required: ['name'],
    additionalProperties: false
};
exports.toMongooseSchema = {
    id: "http://example.com/schema/mongoose-schema",
    title: "mongoose-schema",
    type: "object",
    format: 'entity-schema',
    properties: {
        _id: {
            title: 'ID',
            type: 'string'
        },
        minLengthStr: {
            title: 'Min Length String',
            type: 'string',
            minLength: 1
        },
        maxLengthStr: {
            title: 'Max Length String',
            type: 'string',
            maxLength: 5
        },
        minAndMaxLengthStr: {
            title: 'Min and Max Length String',
            type: 'string',
            minLength: 1,
            maxLength: 5
        },
        patternStr: {
            title: 'Pattern String',
            type: 'string',
            pattern: '^[A-Za-z]+$'
        },
        booleanProp: {
            title: 'Boolean',
            type: 'boolean'
        },
        objectProp: {
            title: 'Object',
            type: 'object'
        },
        numberProp: {
            title: 'Number',
            type: 'number'
        },
        arrayProp: {
            title: 'Array',
            type: 'array'
        }
    },
    required: [
        'minLengthStr', 'maxLengthStr', 'minAndMaxLengthStr', 'patternStr',
        'booleanProp', 'objectProp', 'numberProp', 'arrayProp'
    ],
    additionalProperties: false
};
exports.validEntitySchemaUniques = {
    id: 'http://example.com/schema/valid-entity-schema-uniques',
    title: 'valid-entity-schema-uniques',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            $ref: 'http://example.com/schema/valid-app-schema'
        },
        abbrev: {
            title: 'Abbrev',
            type: 'string',
            _esUnique: true
        }
    },
    required: ['name'],
    additionalProperties: false
};
exports.validEntitySchemaUniquesAdded = {
    id: 'http://example.com/schema/valid-entity-schema-uniques',
    title: 'valid-entity-schema-uniques',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            id: 'http://example.com/schema/valid-app-schema',
            title: 'valid-app-schema',
            type: 'string',
            minLength: 1,
            maxLength: 10,
            pattern: '^[A-Za-z]+$'
        },
        abbrev: {
            title: 'Abbrev',
            type: 'string',
            _esUnique: true,
            not: {
                enum: ['foo', 'bar']
            }
        }
    },
    required: ['name'],
    additionalProperties: false
};
exports.entitySchemaWithArray = {
    id: 'http://example.com/schema/entity-schema-array',
    title: 'entity-schema-array',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            $ref: 'http://example.com/schema/valid-app-schema'
        },
        abbrev: {
            title: 'Abbrev',
            type: 'string',
            _esUnique: true
        },
        tags: {
            title: 'Tags',
            type: 'array',
            items: {
                type: 'string'
            }
        }
    },
    required: ['name', 'abbrev'],
    additionalProperties: false
};
exports.entitySchemaWithLinks = {
    id: 'http://example.com/schema/entity-schema-links',
    title: 'entity-schema-links',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            $ref: 'http://example.com/schema/valid-app-schema'
        },
        validEntity: {
            title: "Valid Entity",
            type: "object",
            properties: {
                entityId: {
                    title: "ID",
                    type: "string",
                    pattern: "^[0-9a-f]{24}$",
                    message: "Parent must be a 24 character hex string. (0-9, a-f)"
                },
                entityType: {
                    title: "Entity Type",
                    type: "string",
                    enum: ["valid-entity-schema"],
                    readOnly: true,
                    default: "valid-entity-schema"
                }
            },
            required: ["entityId", "entityType"],
            additionalProperties: false
        }
    },
    additionalProperties: false
};
exports.entitySchemaWithLinksAdded = {
    id: 'http://example.com/schema/entity-schema-links',
    title: 'entity-schema-links',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            id: 'http://example.com/schema/valid-app-schema',
            title: 'valid-app-schema',
            type: 'string',
            minLength: 1,
            maxLength: 10,
            pattern: '^[A-Za-z]+$'
        },
        validEntity: {
            title: "Valid Entity",
            type: "object",
            properties: {
                entityId: {
                    title: "ID",
                    type: "string",
                    pattern: "^[0-9a-f]{24}$",
                    message: "Parent must be a 24 character hex string. (0-9, a-f)",
                    enum: ['foo'],
                    _esTitles: ['Foo']
                },
                entityType: {
                    title: "Entity Type",
                    type: "string",
                    enum: ["valid-entity-schema"],
                    readOnly: true,
                    default: "valid-entity-schema"
                }
            },
            required: ["entityId", "entityType"],
            additionalProperties: false
        }
    },
    additionalProperties: false
};
exports.validEnumSchema = {
    id: 'fjkshfgjsd',
    title: "Copyright",
    type: "string",
    enum: [
        "notSpecified", "other", "internal", "manufacturer"
    ],
    _esTitles: [
        "Not Specified", "Other", "Internal", "Manufacturer"
    ]
};
exports.validChildSchema = {
    id: 'http://example.com/schema/valid-child-schema',
    title: 'valid-child-schema',
    type: 'object',
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
    wsParent: 'Parent',
    _esParentKey: 'parent',
    required: ['name'],
    additionalProperties: false
};
exports.validConstSchema = {
    title: 'valid-const-schema',
    type: 'string',
    enum: ['const'],
    default: 'const',
    readOnly: true
};
exports.validOneOfSchema = {
    id: 'http://example.com/schema/valid-oneof-schema',
    title: 'valid-oneof-schema',
    type: 'string',
    oneOf: [
        {
            title: 'first',
            type: 'string'
        },
        {
            title: 'second',
            type: 'string'
        }
    ]
};
exports.withOneOf = {
    id: 'http://example.com/schema/entity-schema-oneof',
    title: 'entity-schema-oneof',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            $ref: 'http://example.com/schema/valid-app-schema'
        },
        one: {
            $ref: 'http://example.com/schema/valid-oneof-schema'
        }
    },
    required: ['name', 'one'],
    additionalProperties: false
};
//# sourceMappingURL=schema.js.map