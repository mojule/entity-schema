"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("../security/app-schema/user-schema");
const json_pointer_1 = require("@mojule/json-pointer");
const types_1 = require("../security/types");
const SchemaMapper = require("@mojule/schema-mapper");
const mz_1 = require("mz");
const app_schema_1 = require("../files/app-schema");
const api_key_schema_1 = require("../security/app-schema/api-key-schema");
const user_reference_schema_1 = require("../security/app-schema/user-reference-schema");
const flat = json_pointer_1.flatten(user_schema_1.userSchema);
console.log('flat', JSON.stringify(flat, null, 2));
const pvas = json_pointer_1.pointerValueArray(flat);
const securityGlob = '**/wsSecurity/**';
const securityPvs = json_pointer_1.globPointerValues(pvas, securityGlob);
console.log('securityPvs', JSON.stringify(securityPvs, null, 2));
const passwordSecurity = json_pointer_1.get(user_schema_1.userSchema, '/properties/password/wsSecurity');
console.log('passwordSecurity', JSON.stringify(passwordSecurity));
const getParentPath = (path, search) => {
    const segs = path.split('/');
    const searchIndex = segs.indexOf(search);
    if (searchIndex === -1)
        return;
    return segs.slice(0, searchIndex).join('/');
};
console.log('getParentPath', getParentPath('/properties/password/wsSecurity/create/0', 'wsSecurity'));
console.log('getParentPath', JSON.stringify(getParentPath('/wsSecurity/delete/0', 'wsSecurity')));
const securePointerNames = new Set();
securityPvs.forEach(pv => {
    const parentPath = getParentPath(pv.pointer, 'wsSecurity');
    if (parentPath !== undefined)
        securePointerNames.add(parentPath);
});
const securePaths = Array.from(securePointerNames);
const securityMap = securePaths.reduce((map, pointer) => {
    map[pointer] = json_pointer_1.get(user_schema_1.userSchema, pointer + '/wsSecurity');
    return map;
}, {});
console.log('securityMap', JSON.stringify(securityMap, null, 2));
const filterSchemaForRoles = (schema, userRoles) => {
    const flat = json_pointer_1.flatten(schema);
    const pvas = json_pointer_1.pointerValueArray(flat);
    const securityGlob = '**/wsSecurity/**';
    const securityPvs = json_pointer_1.globPointerValues(pvas, securityGlob);
    const securePointerNames = new Set();
    securityPvs.forEach(pv => {
        const parentPath = getParentPath(pv.pointer, 'wsSecurity');
        if (parentPath !== undefined)
            securePointerNames.add(parentPath);
    });
    const securePaths = Array.from(securePointerNames);
    const securityMap = securePaths.reduce((map, pointer) => {
        map[pointer] = json_pointer_1.get(user_schema_1.userSchema, pointer + '/wsSecurity');
        return map;
    }, {});
    const filteredPvs = pvas.filter(pv => {
        if (pv.pointer.includes('/ws'))
            return false;
        if (pv.pointer.includes('/required/')) {
            const parent = getParentPath(pv.pointer, 'required');
            const propertyPath = parent + '/properties/' + pv.value;
            if (propertyPath in securityMap) {
                const expectedRoles = securityMap[propertyPath].read;
                return expectedRoles.some(expectedRole => userRoles.includes(expectedRole));
            }
        }
        const securePath = securePaths.find(sp => pv.pointer.startsWith(sp));
        if (securePath === undefined) {
            return true;
        }
        const expectedRoles = securityMap[securePath].read;
        return expectedRoles.some(expectedRole => userRoles.includes(expectedRole));
    });
    const pointerMap = json_pointer_1.pointerValueArrayToPointerMap(filteredPvs);
    const filteredSchema = json_pointer_1.expand(pointerMap);
    return filteredSchema;
};
const schemaForAdmin = filterSchemaForRoles(user_schema_1.userSchema, [types_1.Roles.admin]);
const schemaForCurrentUser = filterSchemaForRoles(user_schema_1.userSchema, [types_1.Roles.currentUser]);
const schemaForUser = filterSchemaForRoles(user_schema_1.userSchema, [types_1.Roles.user]);
console.log(JSON.stringify({ schemaForAdmin, schemaForCurrentUser, schemaForUser }, null, 2));
const { from } = SchemaMapper({ omitDefault: false });
const userDefaults = from(user_schema_1.userSchema);
console.log(JSON.stringify(userDefaults, null, 2));
mz_1.fs.writeFileSync('./src/sandbox/zip-file.schema.json', JSON.stringify(app_schema_1.zipFileSchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/image-file.schema.json', JSON.stringify(app_schema_1.imageFileSchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/disk-file.schema.json', JSON.stringify(app_schema_1.diskFileSchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/zip-file-reference.schema.json', JSON.stringify(app_schema_1.zipFileReferenceSchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/image-file-reference.schema.json', JSON.stringify(app_schema_1.imageFileReferenceSchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/disk-file-reference.schema.json', JSON.stringify(app_schema_1.diskFileReferenceSchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/api-key.schema.json', JSON.stringify(api_key_schema_1.apiKeySchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/user.schema.json', JSON.stringify(user_schema_1.userSchema, null, 2), 'utf8');
mz_1.fs.writeFileSync('./src/sandbox/user-reference.schema.json', JSON.stringify(user_reference_schema_1.userReferenceSchema, null, 2), 'utf8');
//# sourceMappingURL=index.js.map