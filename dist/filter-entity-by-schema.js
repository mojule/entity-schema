"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subschema_map_1 = require("./subschema-map");
const json_pointer_1 = require("@mojule/json-pointer");
const escapeRegExp = require("lodash.escaperegexp");
exports.filterEntityBySchema = (entity, schema) => {
    const schemaPathMap = subschema_map_1.subschemaMap(schema);
    const entityPathMap = json_pointer_1.flatten(entity);
    const filteredEntityPathMap = {};
    const schemaPathRegexps = Object.keys(schemaPathMap).map(pointerPath => {
        // first, replace instances of [] in the path with a token
        const arrayRefsToTokens = pointerPath.replace(/\[\]/g, '~~array~~');
        // escape out any characters in path that clash with regexp
        const asRegex = escapeRegExp(arrayRefsToTokens);
        // replace the array token with a regexp to match one or more digits
        const replaceArrayWithDigitRegexp = asRegex.replace(/~~array~~/g, '\\d+');
        return new RegExp('^' + replaceArrayWithDigitRegexp + '$');
    });
    Object.keys(entityPathMap).forEach(pointerPath => {
        if (schemaPathRegexps.some(regexp => regexp.test(pointerPath)))
            filteredEntityPathMap[pointerPath] = entityPathMap[pointerPath];
    });
    const filteredEntity = json_pointer_1.expand(filteredEntityPathMap);
    return filteredEntity;
};
//# sourceMappingURL=filter-entity-by-schema.js.map