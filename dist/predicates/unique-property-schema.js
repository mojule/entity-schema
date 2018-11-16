"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_schema_1 = require("./typed-schema");
exports.isUniquePropertySchema = (value) => value &&
    value._esUnique === true &&
    typed_schema_1.isTypedSchema(value);
//# sourceMappingURL=unique-property-schema.js.map