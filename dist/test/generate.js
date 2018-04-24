"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const schema_1 = require("./fixtures/schema");
const generate_typescript_1 = require("../typescript/generate-typescript");
describe('generate', () => {
    it('generates typescript interfaces', done => {
        const schemaMap = [schema_1.validAppSchema, schema_1.validEntitySchema];
        generate_typescript_1.generateTypescript(schemaMap).then(typescript => {
            const { enums, interfaces } = typescript;
            assert(Array.isArray(enums));
            assert(Array.isArray(interfaces));
            done();
        });
    });
});
//# sourceMappingURL=generate.js.map