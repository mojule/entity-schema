"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root_routes_1 = require("./root-routes");
const schema_routes_1 = require("./schema-routes");
const entity_routes_1 = require("./entity-routes");
const templates_1 = require("../templates");
const file_routes_1 = require("./file-routes");
const unmatchedRoutes = {
    '/(.*)': (req, res) => {
        const err = Error(`Unexpected path ${req.path}`);
        res.send(templates_1.ErrorPage(err));
    }
};
exports.Routes = (deps) => {
    const { resolverNames } = deps;
    const fileRoutes = file_routes_1.FileRoutes(resolverNames);
    return Object.assign({}, root_routes_1.rootRoutes, schema_routes_1.schemaRoutes, entity_routes_1.entityRoutes, fileRoutes, unmatchedRoutes);
};
//# sourceMappingURL=index.js.map