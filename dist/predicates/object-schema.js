"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@mojule/is");
const app_schema_1 = require("./app-schema");
const subschema_1 = require("./subschema");
const entity_schema_1 = require("./entity-schema");
exports.isObjectSchemaProperties = (value) => is_1.is.object(value) &&
    Object.keys(value).every(key => subschema_1.isSubschema(value[key]) &&
        !entity_schema_1.isEntitySchema(value[key]));
exports.isObjectSchema = (value) => value.type === 'object' &&
    exports.isObjectSchemaProperties(value.properties) &&
    value.additionalProperties === false &&
    app_schema_1.isAppSchema(value);
//# sourceMappingURL=object-schema.js.map