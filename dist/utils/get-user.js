"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../security/types");
const schema_collection_1 = require("../schema-collection");
exports.getUser = (req) => req.user || { roles: [types_1.Roles.public] };
exports.getUserSchemas = (req, schemas, accesses) => schema_collection_1.SchemaCollection(schemas, exports.getUser(req).roles, accesses);
//# sourceMappingURL=get-user.js.map