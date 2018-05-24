"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const json_errors_1 = require("./json-errors");
const schema_collection_1 = require("../../schema-collection");
const types_1 = require("../../security/types");
const is_1 = require("@mojule/is");
exports.SchemaRoutes = (schemaMap) => {
    const schemaRoute = title => {
        const routePath = lodash_1.kebabCase(title);
        return {
            [routePath]: {
                get: (req, res) => {
                    try {
                        const user = req.user || { roles: [types_1.Roles.public] };
                        const schema = schemas.filterForRoles(title, user.roles);
                        if (is_1.is.empty(schema)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
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
                        const user = req.user || { roles: [types_1.Roles.public] };
                        const schema = schemas.filterForRoles(title, user.roles, true);
                        if (is_1.is.empty(schema)) {
                            json_errors_1.notFoundError(res, Error(`${routePath} not found`));
                            return;
                        }
                        res.json(schema);
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
                const user = req.user || { roles: [types_1.Roles.public] };
                const titles = schemas.titlesForRoles(user.roles);
                res.json(titles.map(lodash_1.kebabCase));
            }
        },
        'map': {
            get: (req, res) => {
                const user = req.user || { roles: [types_1.Roles.public] };
                const titles = schemas.titlesForRoles(user.roles);
                const schemaMapForRoles = titles.reduce((map, title) => {
                    const schema = schemas.filterForRoles(title, user.roles);
                    if (is_1.is.empty(schema))
                        return map;
                    map[schema.id] = schema;
                    return map;
                }, {});
                res.json(schemaMapForRoles);
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