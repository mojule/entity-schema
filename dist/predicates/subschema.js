"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_schema_1 = require("./ref-schema");
const typed_schema_1 = require("./typed-schema");
exports.isSubschema = (value) => ref_schema_1.isRefSchema(value) || typed_schema_1.isTypedSchema(value);
//# sourceMappingURL=subschema.js.map