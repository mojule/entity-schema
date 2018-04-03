"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@mojule/is");
exports.isRefSchema = (value) => is_1.is.object(value) &&
    is_1.is.string(value.$ref);
//# sourceMappingURL=ref-schema.js.map