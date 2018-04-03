"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_schema_1 = require("./ws-schema");
const is_1 = require("@mojule/is");
exports.isAppSchema = (value) => value &&
    is_1.is.string(value.id) &&
    ws_schema_1.isWsSchema(value);
//# sourceMappingURL=app-schema.js.map