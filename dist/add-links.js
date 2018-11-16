"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mapper = require("@mojule/mapper");
const is_1 = require("@mojule/is");
const schema_walk_1 = require("./schema-walk");
const entity_reference_schema_1 = require("./predicates/entity-reference-schema");
const clone = Mapper();
const predicates = {
    link: (value) => is_1.is.object(value) && is_1.is.string(value._id) && is_1.is.string(value.name),
    linkList: (value) => is_1.is.array(value) && value.every(predicates.link)
};
exports.addLinks = (schema, linkMap) => {
    schema = clone(schema);
    schema_walk_1.schemaWalk(schema, subSchema => {
        if (entity_reference_schema_1.isEntityReferenceSchema(subSchema)) {
            const title = subSchema.properties.entityType.default;
            const links = linkMap[title];
            if (!predicates.linkList(links))
                throw Error(`Expected a list of links for ${title}`);
            subSchema.properties.entityId.enum = links.map(link => link._id);
            subSchema.properties.entityId._esTitles = links.map(link => link.name);
        }
    });
    return schema;
};
//# sourceMappingURL=add-links.js.map