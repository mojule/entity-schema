"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root_1 = require("./root");
const schema_1 = require("./schema");
const entity_1 = require("./entity");
const templates_1 = require("../templates");
const unmatchedRoutes = {
    '/(.*)': (req, res) => {
        const err = Error(`Unexpected path ${req.path}`);
        res.send(templates_1.ErrorPage(err));
    }
};
exports.routes = Object.assign({}, root_1.rootRoutes, schema_1.schemaRoutes, entity_1.entityRoutes, unmatchedRoutes);
//# sourceMappingURL=index.js.map