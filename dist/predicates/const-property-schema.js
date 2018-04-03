"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_schema_1 = require("./ws-schema");
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
    ws_schema_1.isWsSchema(value);
//# sourceMappingURL=const-property-schema.js.map