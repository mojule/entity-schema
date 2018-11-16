"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_schema_1 = require("./typed-schema");
const is_1 = require("@mojule/is");
exports.isRootSchema = (value) => value &&
    is_1.is.string(value.id) &&
    typed_schema_1.isTypedSchema(value);
//# sourceMappingURL=root-schema.js.map