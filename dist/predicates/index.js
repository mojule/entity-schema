"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@mojule/is");
const oneof_schema_1 = require("./oneof-schema");
const entity_schema_1 = require("./entity-schema");
const root_schema_1 = require("./root-schema");
const enum_schema_1 = require("./enum-schema");
const ref_schema_1 = require("./ref-schema");
const child_entity_schema_1 = require("./child-entity-schema");
const const_property_schema_1 = require("./const-property-schema");
const entity_reference_schema_1 = require("./entity-reference-schema");
const subschema_1 = require("./subschema");
const typed_schema_1 = require("./typed-schema");
const object_schema_1 = require("./object-schema");
const string_schema_1 = require("./string-schema");
const number_schema_1 = require("./number-schema");
const boolean_schema_1 = require("./boolean-schema");
const array_schema_1 = require("./array-schema");
const integer_schema_1 = require("./integer-schema");
// object key order is important - will match in that order when finding types!
exports.predicates = {
    oneOfSchema: oneof_schema_1.isOneOfSchema,
    constPropertySchema: const_property_schema_1.isConstPropertySchema,
    stringSchema: string_schema_1.isStringSchema,
    numberSchema: number_schema_1.isNumberSchema,
    integerSchema: integer_schema_1.isIntegerSchema,
    booleanSchema: boolean_schema_1.isBooleanSchema,
    arraySchema: array_schema_1.isArraySchema,
    childEntitySchema: child_entity_schema_1.isChildEntitySchema,
    entitySchema: entity_schema_1.isEntitySchema,
    entityReferenceSchema: entity_reference_schema_1.isEntityReferenceSchema,
    objectSchema: object_schema_1.isObjectSchema,
    rootSchema: root_schema_1.isRootSchema,
    refSchema: ref_schema_1.isRefSchema,
    enumSchema: enum_schema_1.isEnumSchema,
    typedSchema: typed_schema_1.isTypedSchema,
    subSchema: subschema_1.isSubschema,
    anySchema: (value) => is_1.is.object(value)
};
exports.predicateUtils = is_1.Utils(exports.predicates);
//# sourceMappingURL=index.js.map