"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const json_errors_1 = require("./json-errors");
const schema_collection_1 = require("../../schema-collection");
exports.SchemaRoutes = (schemaMap) => {
    const schemaRoute = title => {
        const routePath = lodash_1.kebabCase(title);
        return {
            [routePath]: {
                get: (req, res) => {
                    try {
                        res.json(schemas.get(title));
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            },
            [`${routePath}/normalized`]: {
                get: (req, res) => {
                    try {
                        res.json(schemas.normalize(title));
                    }
                    catch (err) {
                        json_errors_1.serverError(res, err);
                    }
                }
            }
        };
    };
    const schemas = schema_collection_1.SchemaCollection(schemaMap);
    const { titles } = schemas;
    const rootRoute = {
        '.': {
            get: (req, res) => {
                res.json(titles.map(lodash_1.kebabCase));
            }
        },
        'map': {
            get: (req, res) => {
                res.json(schemaMap);
            }
        }
    };
    return titles.reduce((routeData, title) => {
        const currentRouteData = schemaRoute(title);
        Object.assign(routeData, currentRouteData);
        return routeData;
    }, rootRoute);
};
//# sourceMappingURL=schema-routes.js.map