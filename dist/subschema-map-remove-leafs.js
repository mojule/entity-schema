"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_walk_1 = require("./schema-walk");
const _1 = require(".");
const clone = subject => JSON.parse(JSON.stringify(subject));
exports.subschemaMapRemoveLeafNodes = (schema) => {
    const schemaMap = {};
    schema_walk_1.schemaWalk(schema, (subSchema, path) => {
        subSchema = clone(subSchema);
        if (_1.predicates.oneOfSchema(subSchema)) {
            delete subSchema.oneOf;
        }
        else if (_1.predicates.arraySchema(subSchema)) {
            delete subSchema.items;
        }
        else if (_1.predicates.objectSchema) {
            delete subSchema.properties;
        }
        schemaMap[path] = subSchema;
    });
    return schemaMap;
};
//# sourceMappingURL=subschema-map-remove-leafs.js.map