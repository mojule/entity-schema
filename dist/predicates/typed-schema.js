"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@mojule/is");
const schemaTypes = [
    'string', 'number', 'integer', 'boolean', 'object', 'array'
];
exports.isTypedSchema = (value) => is_1.is.object(value) &&
    is_1.is.string(value.title) &&
    schemaTypes.includes(value.type);
//# sourceMappingURL=typed-schema.js.map