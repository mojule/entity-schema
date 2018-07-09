"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_schema_1 = require("./ws-schema");
exports.isUniquePropertySchema = (value) => value &&
    value.wsUnique === true &&
    ws_schema_1.isWsSchema(value);
//# sourceMappingURL=unique-property-schema.js.map