"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tv4 = require("tv4");
const schema_map_1 = require("./schema-map");
const normalize_schema_1 = require("./normalize-schema");
const predicates_1 = require("./predicates");
const unique_values_1 = require("./utils/unique-values");
const schema_to_mongoose_schema_1 = require("./schema-to-mongoose-schema");
const interface_schema_mapper_1 = require("./interface-schema-mapper");
const unique_properties_1 = require("./unique-properties");
const filter_entity_by_schema_1 = require("./filter-entity-by-schema");
const uploadable_properties_1 = require("./uploadable-properties");
const SchemaMapResolver = (schemaMap) => (id) => schemaMap[id];
const validateSchemas = (schemas) => {
    if (!Array.isArray(schemas)) {
        throw Error('Expected an array of app schema');
    }
    const badSchemas = schemas.filter(schema => !predicates_1.predicates.appSchema(schema));
    if (badSchemas.length) {
        let err = Error(`${badSchemas.length} bad schemas found`);
        try {
            const badSchemaList = badSchemas.map(bad => JSON.stringify(bad)).join('\n');
            err = Error(`Bad schemas:\n${badSchemaList}`);
        }
        catch (e) {
            throw err;
        }
        throw err;
    }
    if (schemas.length === 0)
        throw Error('Must provide at least one schema');
    if (!unique_values_1.uniqueValues(schemas, 'title'))
        throw Error('Expected title property to be unique within schemas');
};
exports.SchemaCollection = (schemas) => {
    validateSchemas(schemas);
    const map = schema_map_1.SchemaMap(schemas);
    const resolver = SchemaMapResolver(map);
    const normalize = normalize_schema_1.NormalizeSchema(resolver);
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
        get: (title) => {
            assertTitle(title);
            return titleMap[title];
        },
        normalize: (title) => {
            assertTitle(title);
            if (normalizedSchemaCache.has(title))
                return normalizedSchemaCache.get(title);
            const normalizedSchema = normalize(titleMap[title]);
            normalizedSchemaCache.set(title, normalizedSchema);
            return normalizedSchema;
        },
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
            if (schema.wsParentProperty)
                return schema.wsParentProperty;
        }
    };
    return api;
};
//# sourceMappingURL=schema-collection.js.map