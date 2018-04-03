"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_schema_1 = require("./ref-schema");
const ws_schema_1 = require("./ws-schema");
exports.isSubschema = (value) => ref_schema_1.isRefSchema(value) || ws_schema_1.isWsSchema(value);
//# sourceMappingURL=subschema.js.map