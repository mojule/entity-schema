"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_schema_1 = require("./typed-schema");
const is_1 = require("@mojule/is");
const const_property_schema_1 = require("./const-property-schema");
exports.isEntityIdSchema = (value) => value &&
    value.type === 'string' &&
    value.pattern === '^[0-9a-f]{24}$' &&
    typed_schema_1.isTypedSchema(value);
exports.isEntityReferenceSchema = (value) => value &&
    value.type === 'object' &&
    is_1.is.object(value.properties) &&
    exports.isEntityIdSchema(value.properties.entityId) &&
    const_property_schema_1.isConstPropertySchema(value.properties.entityType) &&
    typed_schema_1.isTypedSchema(value);
//# sourceMappingURL=entity-reference-schema.js.map