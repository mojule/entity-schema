"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_walk_1 = require("./schema-walk");
exports.subschemaMap = (schema) => {
    const schemaMap = {};
    schema_walk_1.schemaWalk(schema, (subSchema, path) => {
        schemaMap[path] = subSchema;
    });
    return schemaMap;
};
//# sourceMappingURL=subschema-map.js.map