"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_schema_1 = require("./ws-schema");
const is_1 = require("@mojule/is");
exports.isEnumSchema = (value) => value &&
    value.type === 'string' &&
    is_1.is.array(value.enum) &&
    value.enum.every(is_1.is.string) &&
    is_1.is.array(value.wsEnumTitles) &&
    value.wsEnumTitles.every(is_1.is.string) &&
    value.enum.length === value.wsEnumTitles.length &&
    ws_schema_1.isWsSchema(value);
//# sourceMappingURL=enum-schema.js.map