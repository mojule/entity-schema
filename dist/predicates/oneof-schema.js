"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_schema_1 = require("./typed-schema");
const subschema_1 = require("./subschema");
const is_1 = require("@mojule/is");
exports.isOneOfSchema = (value) => is_1.is.array(value.oneOf) &&
    value.oneOf.every(subschema_1.isSubschema) &&
    typed_schema_1.isTypedSchema(value);
//# sourceMappingURL=oneof-schema.js.map