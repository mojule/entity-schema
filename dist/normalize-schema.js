"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mapper = require("@mojule/mapper");
const is_1 = require("@mojule/is");
exports.NormalizeSchema = (resolve) => {
    const predicates = {
        $ref: subject => is_1.is.object(subject) && is_1.is.string(subject.$ref)
    };
    const map = {
        /*
          According to the spec, any schema with a $ref property should be entirely
          replaced with the schema it references, not extended
        */
        $ref: (value, { mapper }) => {
            const id = value.$ref;
            return mapper(resolve(id));
        }
    };
    const normalize = Mapper({ map, predicates });
    return normalize;
};
//# sourceMappingURL=normalize-schema.js.map