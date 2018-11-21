"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tv4 = require("tv4");
const schema_to_mongoose_schema_1 = require("./schema-to-mongoose-schema");
const interface_schema_mapper_1 = require("./interface-schema-mapper");
const unique_properties_1 = require("./unique-properties");
const filter_entity_by_schema_1 = require("./filter-entity-by-schema");
const uploadable_properties_1 = require("./uploadable-properties");
const types_1 = require("./security/types");
const filter_schema_for_roles_1 = require("./filter-schema-for-roles");
const is_1 = require("@mojule/is");
const predicates_1 = require("@entity-schema/predicates");
const collection_1 = require("@entity-schema/collection");
exports.SchemaCollection = (schemas, userRoles, accesses = [types_1.EntityAccesses.read]) => {
    if (Array.isArray(userRoles)) {
        schemas = schemas.map(schema => {
            const filterForRoles = filter_schema_for_roles_1.FilterSchemaForRoles(schema);
            return filterForRoles(userRoles, accesses);
        }).filter(schema => !is_1.is.empty(schema));
    }
    const map = collection_1.createRootSchemaMap(schemas);
    const validator = tv4.freshApi();
    const titles = [];
    const titleMap = {};
    const entitySchemas = [];
    const entityTitles = [];
    const enumTitles = [];
    schemas.forEach(schema => {
        const { title } = schema;
        titles.push(title);
        titleMap[title] = schema;
        if (predicates_1.predicates.entitySchema(schema)) {
            entitySchemas.push(schema);
            entityTitles.push(title);
        }
        if (predicates_1.predicates.enumSchema(schema)) {
            enumTitles.push(title);
        }
        tv4.addSchema(schema);
    });
    const assertTitle = title => {
        if (!titles.includes(title))
            throw Error(`No schema in collection with title ${title}`);
    };
    const assertEntityTitle = title => {
        if (!entityTitles.includes(title))
            throw Error(`No entity schema in collection with title ${title}`);
    };
    const normalizedSchemaCache = new Map();
    const interfaceSchemaCache = new Map();
    const mongooseSchemaCache = new Map();
    const api = {
        get titles() {
            return titles.slice();
        },
        get entityTitles() {
            return entityTitles.slice();
        },
        get enumTitles() {
            return enumTitles.slice();
        },
        get validator() {
            return validator;
        },
        get entities() {
            return entitySchemas.slice();
        },
        get map() {
            return JSON.parse(JSON.stringify(map));
        },
        get: (title) => {
            assertTitle(title);
            return titleMap[title];
        },
        normalize: (title) => {
            assertTitle(title);
            if (normalizedSchemaCache.has(title))
                return normalizedSchemaCache.get(title);
            const schema = titleMap[title];
            const normalizedSchema = collection_1.resolveRefSchemas(schema.id, map);
            normalizedSchemaCache.set(title, normalizedSchema);
            return normalizedSchema;
        },
        // modifies a schema to be compatible with the schema-to-interface code
        // eg changes title to ISomeSchema etc
        interfaceSchema: (title) => {
            assertTitle(title);
            if (interfaceSchemaCache.has(title))
                return interfaceSchemaCache.get(title);
            const schema = api.normalize(title);
            const interfaceSchema = interface_schema_mapper_1.interfaceSchemaMapper(schema);
            interfaceSchemaCache.set(title, interfaceSchema);
            return interfaceSchema;
        },
        mongooseSchema: (title) => {
            assertEntityTitle(title);
            if (mongooseSchemaCache.has(title))
                return mongooseSchemaCache.get(title);
            const schema = api.normalize(title);
            const mongooseSchema = schema_to_mongoose_schema_1.schemaToMongooseSchema(schema);
            mongooseSchemaCache.set(title, mongooseSchema);
            return mongooseSchema;
        },
        uniquePropertyNames: (title) => {
            assertEntityTitle(title);
            const schema = api.normalize(title);
            return unique_properties_1.uniquePropertyNames(schema);
        },
        uploadablePropertyNames: (title) => {
            assertEntityTitle(title);
            const schema = api.normalize(title);
            return uploadable_properties_1.uploadablePropertyNames(schema);
        },
        filterEntity: (title, entity) => {
            assertEntityTitle(title);
            const schema = api.normalize(title);
            return filter_entity_by_schema_1.filterEntityBySchema(entity, schema);
        },
        parent: (title) => {
            assertEntityTitle(title);
            const schema = api.normalize(title);
            if (schema.wsParent)
                return schema.wsParent;
        },
        parentProperty: (title) => {
            assertEntityTitle(title);
            const schema = api.normalize(title);
            if (schema._esParentKey)
                return schema._esParentKey;
        }
    };
    return api;
};
//# sourceMappingURL=schema-collection.js.map