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
const appSchemaPath = './app-schema';
const excludeOwnProperties = (model, uniqueValuesMap) => {
    const map = {};
    Object.keys(uniqueValuesMap).forEach(propertyName => {
        map[propertyName] = uniqueValuesMap[propertyName].filter(value => value !== model[propertyName]);
    });
    return map;
};
const selectBodyParser = (schema) => (req, res, next) => {
    if (req.headers['content-type'].startsWith('application/json')) {
        jsonParser(req, res, next);
        return;
    }
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
exports.EntityRoutes = (schemaMap) => {
    const createRouteData = (title, uniqueValuePropertyNames, Model) => {
        const uploadablePropertyNames = schemas.uploadablePropertyNames(title);
        const hasUploadableProperties = !!uploadablePropertyNames.length;
        const entitySchema = schemas.normalize(title);
        const parentProperty = schemas.parentProperty(title);
        const routeName = lodash_1.kebabCase(title);
        const getParentId = async (body) => {
            if (parentProperty) {
                if (body[parentProperty] && body[parentProperty].entityId) {
                    return body[parentProperty].entityId;
                }
                throw Error(`Expected post body to have ${parentProperty}.entityId`);
            }
        };
        const addFiles = (req) => {
            if (hasUploadableProperties) {
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
            const { body } = req;
            try {
                addFiles(req);
                const parentId = await getParentId(body);
                const uniqueValuesMap = await Model.uniqueValuesMap(parentId);
                const schema = add_uniques_1.addUniques(entitySchema, uniqueValuesMap);
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
                    const product = await model.save();
                    res.status(201).json(product.toJSON());
                }
                else {
                    res.status(400).json(validate.errors);
                }
            }
            catch (err) {
                json_errors_1.userError(res, err);
            }
        };
        const uploadIfHasFile = (req, res, next) => {
            if (hasUploadableProperties) {
                upload.any()(req, res, next);
                return;
            }
            next();
        };
        const fileHandlers = (finalHandler) => [
            addMetaData({
                title, Model
            }),
            uploadIfHasFile,
            selectBodyParser(entitySchema),
            finalHandler
        ];
        const postHandlers = fileHandlers(postHandler);
        const putHandler = async (req, res) => {
            const id = req.params.id;
            try {
                const doc = await Model.findById(id);
                if (doc === null)
                    throw new json_errors_1.NotFoundError(`No ${title} found for ID ${id}`);
                let { body } = req;
                addFiles(req);
                const parentId = await getParentId(id);
                let uniqueMap = await Model.uniqueValuesMap(parentId);
                uniqueMap = excludeOwnProperties(doc, uniqueMap);
                const schema = add_uniques_1.addUniques(entitySchema, uniqueMap);
                const filteredBody = filter_entity_by_schema_1.filterEntityBySchema(body, schema);
                Object.assign(doc, filteredBody);
                const docAsJson = doc.toJSON();
                const filtered = filter_entity_by_schema_1.filterEntityBySchema(docAsJson, schema);
                const validate = tv4.validateMultiple(filtered, schema);
                if (!validate.valid) {
                    res.status(400).json(validate.errors);
                    return;
                }
                const product = await doc.save();
                res.json(product.toJSON());
            }
            catch (err) {
                json_errors_1.jsonError(res, err);
            }
        };
        const putHandlers = fileHandlers(putHandler);
        return {
            [routeName]: {
                // get list of available ids
                get: async (req, res) => {
                    try {
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
            [`${routeName}/:propertyName/:propertyValue`]: {
                // get a model by a field guaranteed to be unique
                get: async (req, res) => {
                    const propertyName = req.params.propertyName;
                    const propertyValue = req.params.propertyValue;
                    if (!uniqueValuePropertyNames.includes(propertyName)) {
                        const error = Error(`No unique property ${propertyName} found`);
                        json_errors_1.userError(res, error);
                        return;
                    }
                    try {
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
            [`${routeName}/:id([0-9a-f]{24})`]: {
                // get an entity by id
                get: async (req, res) => {
                    const id = req.params.id;
                    try {
                        const doc = await Model.findById(id);
                        if (doc === null)
                            throw new json_errors_1.NotFoundError(`No ${title} found for ID ${id}`);
                        res.json(doc.toJSON());
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
                        const doc = await Model.findById(id);
                        if (doc === null)
                            throw new json_errors_1.NotFoundError(`No ${title} found for ID ${id}`);
                        const removed = await doc.remove();
                        res.json(removed.toJSON());
                    }
                    catch (err) {
                        json_errors_1.jsonError(res, err);
                    }
                }
            },
            [`${routeName}/all`]: {
                // get all entities
                get: async (req, res) => {
                    try {
                        const docs = await Model.find({});
                        res.json(docs);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            },
            [`${routeName}/filter`]: {
                // get all entities matching params
                get: async (req, res) => {
                    try {
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
                        res.json(docs);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            },
            [`${routeName}/:propertyName`]: {
                // get all possible values for the unique named property
                get: async (req, res) => {
                    const propertyName = req.params.propertyName;
                    if (!uniqueValuePropertyNames.includes(propertyName)) {
                        json_errors_1.notFoundError(res, Error(`No unique property ${propertyName} found`));
                        return;
                    }
                    try {
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
    const models = mongoose_models_1.mongooseModels(schemaMap);
    const schemas = schema_collection_1.SchemaCollection(schemaMap);
    const { entityTitles } = schemas;
    const rootRoutes = {
        '.': {
            get: (req, res) => {
                res.json(entityTitles.map(lodash_1.kebabCase));
            }
        }
    };
    return entityTitles.reduce((routeData, title) => {
        const ctorName = pascal_case_1.pascalCase(title);
        const uniqueValuePropertyNames = schemas.uniquePropertyNames(title);
        const Model = models[ctorName];
        const currentRouteData = createRouteData(title, uniqueValuePropertyNames, Model);
        Object.assign(routeData, currentRouteData);
        return routeData;
    }, rootRoutes);
};
//# sourceMappingURL=entity-routes.js.map