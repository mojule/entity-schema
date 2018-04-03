"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaMap = (schemas) => schemas.reduce((map, schema) => {
    if (schema.id === undefined)
        throw Error('Schema ID is required');
    map[schema.id] = schema;
    return map;
}, {});
//# sourceMappingURL=schema-map.js.map