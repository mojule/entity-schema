"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Not implemented using schema predicates like other mappers, because all it
  needs to do is conditionally remove a few properties, so a clone with a custom
  object mapper is sufficient
*/
const Mapper = require("@mojule/mapper");
const pascal_case_1 = require("./utils/pascal-case");
const map = {
    object: (obj, options) => {
        const { mapper, parentKey } = options;
        return Object.keys(obj).reduce((result, key) => {
            /*
              return early to delete id from all input JSON Schema to prevent
              json-schema-to-typescript from trying to resolve URLs in id
            */
            if (key === 'id' && parentKey !== 'properties')
                return result;
            let value = obj[key];
            /*
              if this is an object schema, prefix the title with 'I' so that the
              resultant interface will be named as per convention
      
              otherwise, delete the title to that type aliases will not be generated
              for eg. string properties etc.
            */
            if (key === 'title' && parentKey !== 'properties') {
                if (obj.type && obj.type === 'object') {
                    value = 'I' + pascal_case_1.pascalCase(value);
                }
                else {
                    // returning early deletes the title property
                    return result;
                }
            }
            // ensure that any nested schema are also mapped
            const newOptions = Object.assign({}, options, { parentKey: key });
            result[key] = mapper(value, newOptions);
            return result;
        }, {});
    }
};
exports.interfaceSchemaMapper = Mapper({ map });
//# sourceMappingURL=interface-schema-mapper.js.map