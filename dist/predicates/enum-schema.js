"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_schema_1 = require("./typed-schema");
const is_1 = require("@mojule/is");
exports.isEnumSchema = (value) => value &&
    value.type === 'string' &&
    is_1.is.array(value.enum) &&
    value.enum.every(is_1.is.string) &&
    is_1.is.array(value.wsEnumTitles) &&
    value.wsEnumTitles.every(is_1.is.string) &&
    value.enum.length === value.wsEnumTitles.length &&
    typed_schema_1.isTypedSchema(value);
//# sourceMappingURL=enum-schema.js.map