"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_schema_1 = require("./object-schema");
exports.isEntitySchema = (value) => value &&
    value.format === 'entity-schema' &&
    object_schema_1.isObjectSchema(value);
//# sourceMappingURL=entity-schema.js.map