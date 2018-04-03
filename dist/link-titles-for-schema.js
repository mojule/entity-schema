"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_walk_1 = require("./schema-walk");
const entity_reference_schema_1 = require("./predicates/entity-reference-schema");
exports.linkTitlesForSchema = (entitySchema) => {
    const titles = [];
    schema_walk_1.schemaWalk(entitySchema, subSchema => {
        if (entity_reference_schema_1.isEntityReferenceSchema(subSchema)) {
            const title = subSchema.properties.entityType.default;
            titles.push(title);
        }
    });
    return titles;
};
//# sourceMappingURL=link-titles-for-schema.js.map