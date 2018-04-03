"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_schema_1 = require("./object-schema");
exports.isEntitySchema = (value) => value &&
    value.format === 'workingspec-entity' &&
    object_schema_1.isObjectSchema(value);
//# sourceMappingURL=entity-schema.js.map