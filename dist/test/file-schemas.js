"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const __1 = require("..");
const app_schema_1 = require("../files/app-schema");
describe('File Schemas', () => {
    it('Disk File Schema', () => {
        assert.doesNotThrow(() => {
            const schemaCollection = __1.SchemaCollection([app_schema_1.diskFileSchema]);
        });
    });
});
//# sourceMappingURL=file-schemas.js.map