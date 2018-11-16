"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_schema_1 = require("./entity-schema");
const is_1 = require("@mojule/is");
const entity_reference_schema_1 = require("./entity-reference-schema");
exports.isChildEntitySchema = (value) => value &&
    is_1.is.string(value._esParentKey) &&
    entity_reference_schema_1.isEntityReferenceSchema(value.properties[value._esParentKey]) &&
    entity_schema_1.isEntitySchema(value);
//# sourceMappingURL=child-entity-schema.js.map