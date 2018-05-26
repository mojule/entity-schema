"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const tv4 = require("tv4");
const json_errors_1 = require("./json-errors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const json_pointer_1 = require("@mojule/json-pointer");
const ensure_directories_1 = require("../../utils/ensure-directories");
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
const { from: entityFromSchema } = SchemaMapper({ omitDefault: false });
const jsonParser = bodyParser.json();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { mimetype } = file;
        const { title, Model } = req['_wsMetadata'];
        const model = req['_wsMetadata'].model || Model();
        req['_wsMetadata'].model = model;
        const rootDirectory = mimetype.startsWith('image') ? 'img' : 'files';
        const entityPath = `public/${rootDirectory}/${lodash_1.kebabCase(title)}`;
        const modelPath = `${entityPath}/${model.id}`;
        ensure_directories_1.ensureDirectories(entityPath, modelPath);
        cb(null, modelPath);
    },
    filename: (req, file, cb) => {
        const parsed = path.parse(file.originalname);
        const filename = lodash_1.kebabCase(file.fieldname) + parsed.ext;
        cb(null, filename);
    }
});
const upload = multer({ storage });
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
const selectBodyParser = (req, res, next) => {
    if (req.headers['content-type'].startsWith('application/json')) {
        jsonParser(req, res, next);
        return;
    }
    // add a check here that it's form multipart
    const { body } = req;
    const pointerPaths = Object.keys(body).filter(key => key.startsWith('/'));
    const flatModel = pointerPaths.reduce((obj, pointer) => {
        obj[pointer] = JSON.parse(body[pointer]);
        return obj;
    }, {});
    pointerPaths.forEach(pointer => delete body[pointer]);
    const model = json_pointer_1.expand(flatModel);
    Object.assign(body, model);
    next();
};
const addMetaData = (metadata) => (req, res, next) => {
    Object.assign(req, { _wsMetadata: metadata });
    next();
};
exports.EntityRoutes = (schemaCollection, resolvers = model_resolvers_1.modelResolvers) => {
    if (resolvers !== model_resolvers_1.modelResolvers) {
        resolvers = Object.assign({}, model_resolvers_1.modelResolvers, resolvers);
    }
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
        const addFiles = (req, uploadablePropertyNames) => {
            if (uploadablePropertyNames.length) {
                const { body } = req;
                const files = req.files;
                if (!files)
                    return;
                uploadablePropertyNames.forEach(propertyName => {
                    const file = files.find(f => f.fieldname === '/' + propertyName);
                    if (file) {
                        const urlPath = path.relative('public', file.path).split(path.sep).join(path.posix.sep);
                        body[propertyName] = urlPath;
                    }
                });
            }
        };
        const postHandler = async (req, res) => {
            let { body } = req;
            try {
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.create]);
                if (!userSchemas.titles.includes(title)) {
                    json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                    return;
                }
                const uploadablePropertyNames = userSchemas.uploadablePropertyNames(title);
                const parentProperty = userSchemas.parentProperty(title);
                addFiles(req, uploadablePropertyNames);
                const parentId = getParentId(body, parentProperty);
                const uniqueValuesMap = await Model.uniqueValuesMap(parentId);
                const entitySchema = userSchemas.normalize(title);
                const schema = add_uniques_1.addUniques(entitySchema, uniqueValuesMap);
                const systemSchema = schemas.normalize(title);
                const defaultValues = entityFromSchema(systemSchema);
                body = deep_assign_1.deepAssign({}, defaultValues, body);
                const validate = tv4.validateMultiple(body, schema);
                if (validate.valid) {
                    let model;
                    if (req['_wsMetadata'].model) {
                        model = req['_wsMetadata'].model;
                        Object.assign(model, body);
                    }
                    else {
                        model = new Model(body);
                    }
                    let meta;
                    if (title in resolvers) {
                        const resolved = await resolvers[title](types_1.EntityAccesses.create, model, body, req, res);
                        model = resolved.document;
                        meta = resolved.meta;
                    }
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
        const fileHandlers = (finalHandler, accesses) => [
            addMetaData({
                title, Model
            }),
            (req, res, next) => uploadIfHasFile(req, res, next, accesses),
            selectBodyParser,
            finalHandler
        ];
        const postHandlers = fileHandlers(postHandler, [types_1.EntityAccesses.create]);
        const putHandler = async (req, res) => {
            const id = req.params.id;
            try {
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.EntityAccesses.update]);
                if (!userSchemas.titles.includes(title)) {
                    json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                    return;
                }
                const doc = await Model.findById(id);
                if (doc === null)
                    throw new json_errors_1.NotFoundError(`No ${title} found for ID ${id}`);
                let { body } = req;
                const uploadablePropertyNames = userSchemas.uploadablePropertyNames(title);
                addFiles(req, uploadablePropertyNames);
                const parentProperty = userSchemas.parentProperty(title);
                const parentId = getParentId(id, parentProperty);
                let uniqueMap = await Model.uniqueValuesMap(parentId);
                uniqueMap = excludeOwnProperties(doc, uniqueMap);
                const entitySchema = userSchemas.normalize(title);
                const schema = add_uniques_1.addUniques(entitySchema, uniqueMap);
                const filteredBody = filter_entity_by_schema_1.filterEntityBySchema(body, schema);
                Object.assign(doc, filteredBody);
                const docAsJson = doc.toJSON();
                const systemSchema = schemas.normalize(title);
                const filtered = filter_entity_by_schema_1.filterEntityBySchema(docAsJson, systemSchema);
                const validate = tv4.validateMultiple(filtered, systemSchema);
                if (!validate.valid) {
                    res.status(400).json(validate.errors);
                    return;
                }
                const product = await doc.save();
                const filteredResult = filter_entity_by_schema_1.filterEntityBySchema(product.toJSON(), schema);
                filteredResult._id = product._id;
                res.status(201).json(filteredResult);
            }
            catch (err) {
                json_errors_1.jsonError(res, err);
            }
        };
        const putHandlers = fileHandlers(putHandler, [types_1.EntityAccesses.update]);
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