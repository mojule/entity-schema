"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_walk_1 = require("./schema-walk");
const predicates_1 = require("@entity-schema/predicates");
exports.linkTitlesForSchema = (entitySchema) => {
    const titles = [];
    schema_walk_1.schemaWalk(entitySchema, subSchema => {
        if (predicates_1.isEntityReferenceSchema(subSchema)) {
            const title = subSchema.properties.entityType.default;
            titles.push(title);
        }
    });
    return titles;
};
//# sourceMappingURL=link-titles-for-schema.js.map