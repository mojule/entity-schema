"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const tv4 = require("tv4");
const json_errors_1 = require("./json-errors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const json_pointer_1 = require("@mojule/json-pointer");
const schema_collection_1 = require("../../schema-collection");
const pascal_case_1 = require("../../utils/pascal-case");
const mongoose_models_1 = require("../../mongoose/mongoose-models");
const add_uniques_1 = require("../../add-uniques");
const filter_entity_by_schema_1 = require("../../filter-entity-by-schema");
const get_user_1 = require("../../utils/get-user");
const SchemaMapper = require("@mojule/schema-mapper");
const types_1 = require("../../security/types");
const deep_assign_1 = require("../../utils/deep-assign");
const model_resolvers_1 = require("../../model-resolvers");
const file_resolvers_1 = require("../../file-resolvers");
const entity_storage_1 = require("../../file-resolvers/entity-storage");
const get_multipart_values_1 = require("../../utils/get-multipart-values");
const { from: entityFromSchema } = SchemaMapper({ omitDefault: false });
const jsonParser = bodyParser.json();
/*
  when you check that a property value is unique within a collection, you don't
  want it to fail because the existing entity has that property, so remove self
  from the collection before checking
*/
const excludeOwnProperties = (model, uniqueValuesMap) => {
    const map = {};
    Object.keys(uniqueValuesMap).forEach(propertyName => {
        map[propertyName] = uniqueValuesMap[propertyName].filter(value => value !== model[propertyName]);
    });
    return map;
};
/*
  middleware for deciding how to parse the http body

  if the http body is json, use jsonParse, otherwise parse the req.body as if
  it were a multipart form
*/
const selectBodyParser = async (req, res, next) => {
    if (req.headers['content-type'].startsWith('application/json')) {
        jsonParser(req, res, next);
        return;
    }
    // add a check here that it's form multipart
    const body = await get_multipart_values_1.getMultipartFields(req);
    const pointerPaths = Object.keys(body).filter(key => key.startsWith('/'));
    const flatModel = pointerPaths.reduce((obj, pointer) => {
        obj[pointer] = JSON.parse(body[pointer]);
        return obj;
    }, {});
    pointerPaths.forEach(pointer => delete body[pointer]);
    const model = json_pointer_1.expand(flatModel);
    req.body = Object.assign({}, (req.body || {}), body, model);
    next();
};
const addMetaData = (metadata) => (req, res, next) => {
    Object.assign(req, { _wsMetadata: metadata });
    next();
};
const getMetaData = (req) => req['_wsMetadata'];
const entityRouteOptions = {
    modelResolvers: model_resolvers_1.modelResolvers,
    fileResolvers: file_resolvers_1.fileResolvers
};
exports.EntityRoutes = (schemaCollection, options = entityRouteOptions) => {
    if (options !== entityRouteOptions) {
        let { modelResolvers, fileResolvers } = entityRouteOptions;
        modelResolvers = Object.assign({}, modelResolvers, options.modelResolvers);
        fileResolvers = Object.assign({}, fileResolvers, options.fileResolvers);
        options = { modelResolvers, fileResolvers };
    }
    const { modelResolvers, fileResolvers } = options;
    if (modelResolvers === undefined || fileResolvers === undefined)
        throw Error('Expected modelResolvers and fileResolvers');
    const storage = entity_storage_1.EntityStorage(fileResolvers);
    const upload = multer({ storage });
    const models = mongoose_models_1.mongooseModels(schemaCollection);
    const schemas = schema_collection_1.SchemaCollection(schemaCollection);
    const { entityTitles } = schemas;
    const createRouteData = (title, Model) => {
        const routePath = lodash_1.kebabCase(title);
        const getParentId = (body, parentProperty) => {
            if (parentProperty) {
                if (body[parentProperty] && body[parentProperty].entityId) {
                    return body[parentProperty].entityId;
                }
                throw Error(`Expected post body to have ${parentProperty}.entityId`);
            }
        };
        const getFiles = (req, uploadablePropertyNames) => {
            const filePaths = {};
            if (uploadablePropertyNames.length) {
                const files = req.files;
                if (!files)
                    return filePaths;
                uploadablePropertyNames.forEach(propertyName => {
                    const file = files.find(f => f.fieldname === '/' + propertyName);
                    if (file) {
                        const urlPath = path.relative('public', file.path).split(path.sep).join(path.posix.sep);
                        filePaths[propertyName] = urlPath;
                    }
                });
            }
            return filePaths;
        };
        const getSchema = async (userSchemas, body) => {
            try {
                const parentProperty = userSchemas.parentProperty(title);
                const parentId = getParentId(body, parentProperty);
                const uniqueValuesMap = await Model.uniqueValuesMap(parentId);
                const entitySchema = userSchemas.normalize(title);
                const schema = add_uniques_1.addUniques(entitySchema, uniqueValuesMap);
                return schema;
            }
            catch (err) {
                throw err;
            }
        };
        const createModelHandler = async (req, res, next) => {
            try {
                let { body } = req;
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.create]);
                if (!userSchemas.titles.includes(title)) {
                    json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                    return;
                }
                const systemSchema = schemas.normalize(title);
                const defaultValues = entityFromSchema(systemSchema);
                // remove empty strings that aren't in required
                Object.keys(defaultValues).forEach(key => {
                    const required = systemSchema.required || [];
                    if (!required.includes(key) && defaultValues[key] === '') {
                        delete defaultValues[key];
                    }
                });
                const schema = await getSchema(userSchemas, body);
                body = filter_entity_by_schema_1.filterEntityBySchema(body, schema);
                body = deep_assign_1.deepAssign({}, defaultValues, body);
                let model = new Model(body);
                let meta;
                if (modelResolvers && (title in modelResolvers)) {
                    const resolved = await modelResolvers[title](types_1.EntityAccesses.create, model, body, req, res);
                    model = resolved.document;
                    meta = resolved.meta;
                }
                addMetaData({
                    Model, model, title, body, meta
                })(req, res, next);
            }
            catch (err) {
                json_errors_1.userError(res, err);
            }
        };
        const updateModelHandler = async (req, res, next) => {
            try {
                const id = req.params.id;
                let { body } = req;
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.create]);
                if (!userSchemas.titles.includes(title)) {
                    json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                    return;
                }
                const systemSchema = schemas.normalize(title);
                let model;
                const result = await Model.findById(id);
                if (result === null)
                    throw new json_errors_1.NotFoundError(`No ${title} found for ID ${id}`);
                model = result;
                const schema = await getSchema(userSchemas, body);
                const filteredModel = filter_entity_by_schema_1.filterEntityBySchema(model.toJSON(), systemSchema);
                body = filter_entity_by_schema_1.filterEntityBySchema(body, schema);
                body = deep_assign_1.deepAssign({}, filteredModel, body);
                Object.assign(model, body);
                let meta;
                if (modelResolvers && (title in modelResolvers)) {
                    const resolved = await modelResolvers[title](types_1.EntityAccesses.create, model, body, req, res);
                    model = resolved.document;
                    meta = resolved.meta;
                }
                addMetaData({
                    Model, model, title, body, meta
                })(req, res, next);
            }
            catch (err) {
                json_errors_1.userError(res, err);
            }
        };
        const createOrUpdateHandler = async (req, res) => {
            try {
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.create]);
                if (!userSchemas.titles.includes(title)) {
                    json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                    return;
                }
                const metadata = getMetaData(req);
                const { model, body, meta } = metadata;
                const uploadablePropertyNames = userSchemas.uploadablePropertyNames(title);
                const schema = await getSchema(userSchemas, body);
                const filePaths = getFiles(req, uploadablePropertyNames);
                Object.keys(filePaths).forEach(key => {
                    const filePath = filePaths[key];
                    body[key] = filePath;
                    model[key] = filePath;
                });
                const validate = tv4.validateMultiple(body, schema);
                if (validate.valid) {
                    const product = await model.save();
                    const filtered = filter_entity_by_schema_1.filterEntityBySchema(product.toJSON(), schema);
                    filtered._id = product._id;
                    if (meta)
                        filtered._meta = meta;
                    res.status(201).json(filtered);
                }
                else {
                    res.status(400).json(validate.errors);
                }
            }
            catch (err) {
                json_errors_1.userError(res, err);
            }
        };
        const uploadIfHasFile = (req, res, next, accesses) => {
            const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, accesses);
            const uploadablePropertyNames = userSchemas.uploadablePropertyNames(title);
            if (uploadablePropertyNames.length) {
                upload.any()(req, res, next);
                return;
            }
            next();
        };
        const fileHandlers = (modelHandler, finalHandler, accesses) => [
            selectBodyParser,
            modelHandler,
            (req, res, next) => uploadIfHasFile(req, res, next, accesses),
            finalHandler
        ];
        const postHandlers = fileHandlers(createModelHandler, createOrUpdateHandler, [types_1.EntityAccesses.create]);
        const putHandlers = fileHandlers(updateModelHandler, createOrUpdateHandler, [types_1.EntityAccesses.update]);
        return {
            [routePath]: {
                // get list of available ids
                get: async (req, res) => {
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const documents = await Model.find({}, '_id');
                        const result = documents.map(r => r._id);
                        res.json(result);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                },
                // create a new entity instance
                post: postHandlers
            },
            [`${routePath}/:propertyName/:propertyValue`]: {
                // get a model by a field guaranteed to be unique
                get: async (req, res) => {
                    const propertyName = req.params.propertyName;
                    const propertyValue = req.params.propertyValue;
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const uniqueValuePropertyNames = userSchemas.uniquePropertyNames(title);
                        if (!uniqueValuePropertyNames.includes(propertyName)) {
                            const error = Error(`No unique property ${propertyName} found`);
                            json_errors_1.userError(res, error);
                            return;
                        }
                        const doc = await Model.findOne({ [propertyName]: propertyValue });
                        if (doc === null)
                            throw new json_errors_1.NotFoundError(`No match found for ${propertyName} = ${propertyValue}`);
                        res.json(doc.toJSON());
                    }
                    catch (err) {
                        json_errors_1.jsonError(res, err);
                    }
                }
            },
            [`${routePath}/:id([0-9a-f]{24})`]: {
                // get an entity by id
                get: async (req, res) => {
                    const id = req.params.id;
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const doc = await Model.findById(id);
                        if (doc === null)
                            throw new json_errors_1.NotFoundError(`No ${title} found for ID ${id}`);
                        const schema = userSchemas.normalize(title);
                        const filteredResult = filter_entity_by_schema_1.filterEntityBySchema(doc.toJSON(), schema);
                        filteredResult._id = doc._id;
                        res.json(filteredResult);
                    }
                    catch (err) {
                        json_errors_1.jsonError(res, err);
                    }
                },
                // update an existing entity
                put: putHandlers,
                delete: async (req, res) => {
                    const id = req.params.id;
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.delete]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const doc = await Model.findById(id);
                        if (doc === null)
                            throw new json_errors_1.NotFoundError(`No ${title} found for ID ${id}`);
                        const removed = await doc.remove();
                        const schema = userSchemas.normalize(title);
                        const filteredResult = filter_entity_by_schema_1.filterEntityBySchema(removed.toJSON(), schema);
                        filteredResult._id = doc._id;
                        res.json(filteredResult);
                    }
                    catch (err) {
                        json_errors_1.jsonError(res, err);
                    }
                }
            },
            [`${routePath}/all`]: {
                // get all entities
                get: async (req, res) => {
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const docs = await Model.find({});
                        const schema = userSchemas.normalize(title);
                        const filtered = docs.map(doc => {
                            const filteredResult = filter_entity_by_schema_1.filterEntityBySchema(doc.toJSON(), schema);
                            filteredResult._id = doc._id;
                            return filteredResult;
                        });
                        res.json(filtered);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            },
            [`${routePath}/filter`]: {
                // get all entities matching params
                get: async (req, res) => {
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const normal = {};
                        const nested = {};
                        Object.keys(req.query).forEach(key => {
                            if (key.startsWith('/')) {
                                nested[key] = req.query[key];
                            }
                            else {
                                normal[key] = req.query[key];
                            }
                        });
                        const query = Object.assign({}, normal, json_pointer_1.expand(nested));
                        const docs = await Model.find(query);
                        const schema = userSchemas.normalize(title);
                        const filtered = docs.map(doc => {
                            const filteredResult = filter_entity_by_schema_1.filterEntityBySchema(doc.toJSON(), schema);
                            filteredResult._id = doc._id;
                            return filteredResult;
                        });
                        res.json(filtered);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            },
            [`${routePath}/:propertyName`]: {
                // get all possible values for the unique named property
                get: async (req, res) => {
                    const propertyName = req.params.propertyName;
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const uniqueValuePropertyNames = userSchemas.uniquePropertyNames(title);
                        if (!uniqueValuePropertyNames.includes(propertyName)) {
                            json_errors_1.notFoundError(res, Error(`No unique property ${propertyName} found`));
                            return;
                        }
                        const values = await Model.valuesForUniqueProperty(propertyName);
                        res.json(values);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            },
        };
    };
    const rootRoutes = {
        '.': {
            get: (req, res) => {
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.read]);
                const { entityTitles } = userSchemas;
                res.json(entityTitles.map(lodash_1.kebabCase));
            }
        }
    };
    return entityTitles.reduce((routeData, title) => {
        const ctorName = pascal_case_1.pascalCase(title);
        const Model = models[ctorName];
        const currentRouteData = createRouteData(title, Model);
        Object.assign(routeData, currentRouteData);
        return routeData;
    }, rootRoutes);
};
//# sourceMappingURL=entity-routes.js.map