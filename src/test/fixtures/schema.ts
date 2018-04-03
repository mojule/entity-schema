import { JSONSchema4 } from 'json-schema'
import { IAppSchema } from '../../predicates/app-schema'
import { IEntitySchema } from '../../predicates/entity-schema'
import { IEnumSchema } from '../../predicates/enum-schema'
import { IChildEntitySchema } from '../../predicates/child-entity-schema'
import { IConstPropertySchema } from '../../predicates/const-property-schema'
import { IOneOfSchema } from '../../predicates/oneof-schema'

export const validAppSchema : IAppSchema = {
  id: 'http://example.com/schema/valid-app-schema',
  title: 'valid-app-schema',
  type: 'string',
  minLength: 1,
  maxLength: 10,
  pattern: '^[A-Za-z]+$'
}

export const validEntitySchema : IEntitySchema = {
  id: 'http://example.com/schema/valid-entity-schema',
  title: 'valid-entity-schema',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    name: {
      $ref: 'http://example.com/schema/valid-app-schema'
    }
  },
  required: [ 'name' ],
  additionalProperties: false
}

export const normalizedValidEntitySchema : IEntitySchema = {
  id: 'http://example.com/schema/valid-entity-schema',
  title: 'valid-entity-schema',
  type: 'object',
  format: 'workingspec-entity',
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
  required: [ 'name' ],
  additionalProperties: false
}

export const validEntitySchemaInterfaceSchema : JSONSchema4 = {
  title: 'IValidEntitySchema',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 10,
      pattern: '^[A-Za-z]+$'
    }
  },
  required: [ 'name' ],
  additionalProperties: false
}

export const toMongooseSchema : IEntitySchema = {
  id: "http://example.com/schema/mongoose-schema",
  title: "mongoose-schema",
  type: "object",
  format: 'workingspec-entity',
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
}

export const validEntitySchemaUniques : IEntitySchema = {
  id: 'http://example.com/schema/valid-entity-schema-uniques',
  title: 'valid-entity-schema-uniques',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    name: {
      $ref: 'http://example.com/schema/valid-app-schema'
    },
    abbrev: {
      title: 'Abbrev',
      type: 'string',
      wsUnique: true
    }
  },
  required: [ 'name' ],
  additionalProperties: false
}

export const validEntitySchemaUniquesAdded : IEntitySchema = {
  id: 'http://example.com/schema/valid-entity-schema-uniques',
  title: 'valid-entity-schema-uniques',
  type: 'object',
  format: 'workingspec-entity',
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
      wsUnique: true,
      not: {
        enum: [ 'foo', 'bar' ]
      }
    }
  },
  required: [ 'name' ],
  additionalProperties: false
}

export const entitySchemaWithArray : IEntitySchema = {
  id: 'http://example.com/schema/entity-schema-array',
  title: 'entity-schema-array',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    name: {
      $ref: 'http://example.com/schema/valid-app-schema'
    },
    abbrev: {
      title: 'Abbrev',
      type: 'string',
      wsUnique: true
    },
    tags: {
      title: 'Tags',
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: [ 'name', 'abbrev' ],
  additionalProperties: false
}

export const entitySchemaWithLinks : IEntitySchema = {
  id: 'http://example.com/schema/entity-schema-links',
  title: 'entity-schema-links',
  type: 'object',
  format: 'workingspec-entity',
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
          enum: [ "valid-entity-schema" ],
          readOnly: true,
          default: "valid-entity-schema"
        }
      },
      required: [ "entityId", "entityType" ],
      additionalProperties: false
    }
  },
  additionalProperties: false
}

export const entitySchemaWithLinksAdded : IEntitySchema = {
  id: 'http://example.com/schema/entity-schema-links',
  title: 'entity-schema-links',
  type: 'object',
  format: 'workingspec-entity',
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
          enum: [ 'foo' ],
          wsEnumTitles: [ 'Foo' ]
        },
        entityType: {
          title: "Entity Type",
          type: "string",
          enum: [ "valid-entity-schema" ],
          readOnly: true,
          default: "valid-entity-schema"
        }
      },
      required: [ "entityId", "entityType" ],
      additionalProperties: false
    }
  },
  additionalProperties: false
}

export const validEnumSchema: IEnumSchema & IAppSchema = {
  id: 'fjkshfgjsd',
  title: "Copyright",
  type: "string",
  enum: [
    "notSpecified", "other", "internal", "manufacturer"
  ],
  wsEnumTitles: [
    "Not Specified", "Other", "Internal", "Manufacturer"
  ]
}

export const validChildSchema: IChildEntitySchema =  {
  id: 'http://example.com/schema/valid-child-schema',
  title: 'valid-child-schema',
  type: 'object',
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
          enum: [ "Parent" ],
          readOnly: true,
          default: "Parent"
        }
      },
      required: [ "entityId", "entityType" ],
      additionalProperties: false
    }
  },
  wsParent: 'Parent',
  wsParentProperty: 'parent',
  required: [ 'name' ],
  additionalProperties: false
}

export const validConstSchema : IConstPropertySchema = {
  title: 'valid-const-schema',
  type: 'string',
  enum: [ 'const' ],
  default: 'const',
  readOnly: true
}

export const validOneOfSchema : IOneOfSchema & IAppSchema = {
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
}

export const withOneOf: IEntitySchema = {
  id: 'http://example.com/schema/entity-schema-oneof',
  title: 'entity-schema-oneof',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    name: {
      $ref: 'http://example.com/schema/valid-app-schema'
    },
    one: {
      $ref: 'http://example.com/schema/valid-oneof-schema'
    }
  },
  required: [ 'name', 'one' ],
  additionalProperties: false
}