"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_pointer_1 = require("@mojule/json-pointer");
const types_1 = require("./security/types");
const getParentPath = (path, search) => {
    const segs = path.split('/');
    const searchIndex = segs.indexOf(search);
    if (searchIndex === -1)
        return;
    return segs.slice(0, searchIndex).join('/');
};
exports.FilterSchemaForRoles = (schema) => {
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
        map[pointer] = json_pointer_1.get(schema, pointer + '/wsSecurity');
        return map;
    }, {});
    const filterSchemaForRoles = (userRoles) => {
        const filteredPvs = pvas.filter(pv => {
            if (!userRoles.includes(types_1.Roles.admin) && pv.pointer.includes('/ws'))
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
    return filterSchemaForRoles;
};
//# sourceMappingURL=filter-schema-for-roles.js.map