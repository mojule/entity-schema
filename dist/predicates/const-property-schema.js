"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_schema_1 = require("./typed-schema");
const Is = require("@mojule/is");
const { is } = Is;
exports.isConstPropertySchema = (value) => value &&
    value.type === 'string' &&
    is.array(value.enum) &&
    value.enum.length === 1 &&
    is.string(value.enum[0]) &&
    value.readOnly === true &&
    is.string(value.default) &&
    value.enum[0] === value.default &&
    typed_schema_1.isTypedSchema(value);
//# sourceMappingURL=const-property-schema.js.map