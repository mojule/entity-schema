"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("./app-schema/user-schema");
const user_reference_schema_1 = require("./app-schema/user-reference-schema");
const api_key_schema_1 = require("./app-schema/api-key-schema");
exports.securitySchemas = [user_schema_1.userSchema, user_reference_schema_1.userReferenceSchema, api_key_schema_1.apiKeySchema];
//# sourceMappingURL=schemas.js.map