"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const json_errors_1 = require("./json-errors");
const schema_collection_1 = require("../../schema-collection");
const types_1 = require("../../security/types");
const get_user_1 = require("../../utils/get-user");
exports.SchemaRoutes = (schemaCollection) => {
    const schemaRoute = title => {
        const routePath = lodash_1.kebabCase(title);
        return {
            [routePath]: {
                get: (req, res) => {
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const schema = userSchemas.get(title);
                        res.json(schema);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            },
            [`${routePath}/normalized`]: {
                get: (req, res) => {
                    try {
                        const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.read]);
                        if (!userSchemas.titles.includes(title)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        const schema = userSchemas.normalize(title);
                        res.json(schema);
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            }
        };
    };
    const rootRoute = {
        '.': {
            get: (req, res) => {
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.read]);
                const { titles } = userSchemas;
                res.json(titles.map(lodash_1.kebabCase));
            }
        },
        'map': {
            get: (req, res) => {
                const userSchemas = get_user_1.getUserSchemas(req, schemaCollection, [types_1.PropertyAccesses.read]);
                res.json(userSchemas.map);
            }
        }
    };
    const schemas = schema_collection_1.SchemaCollection(schemaCollection);
    const { titles } = schemas;
    return titles.reduce((routeData, title) => {
        const currentRouteData = schemaRoute(title);
        Object.assign(routeData, currentRouteData);
        return routeData;
    }, rootRoute);
};
//# sourceMappingURL=schema-routes.js.map