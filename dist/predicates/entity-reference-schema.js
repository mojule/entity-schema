"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_schema_1 = require("./ws-schema");
const is_1 = require("@mojule/is");
const const_property_schema_1 = require("./const-property-schema");
exports.isEntityIdSchema = (value) => value &&
    value.type === 'string' &&
    value.pattern === '^[0-9a-f]{24}$' &&
    ws_schema_1.isWsSchema(value);
exports.isEntityReferenceSchema = (value) => value &&
    value.type === 'object' &&
    is_1.is.object(value.properties) &&
    exports.isEntityIdSchema(value.properties.entityId) &&
    const_property_schema_1.isConstPropertySchema(value.properties.entityType) &&
    ws_schema_1.isWsSchema(value);
//# sourceMappingURL=entity-reference-schema.js.map