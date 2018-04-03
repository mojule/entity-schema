"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mapper = require("@mojule/mapper");
const predicates_1 = require("./predicates");
const is_1 = require("@mojule/is");
const doCallback = (schema, options) => {
    const { callback, pathSegs } = options;
    const path = '/' + pathSegs.join('/');
    callback(schema, path);
};
const map = {
    oneOfSchema: (schema, options) => {
        const { pathSegs, mapper } = options;
        doCallback(schema, options);
        schema.oneOf.forEach((subSchema, i) => {
            const newPathSegs = pathSegs.concat([`?${i}`]);
            const newOptions = Object.assign({}, options, { pathSegs: newPathSegs });
            mapper(subSchema, newOptions);
        });
    },
    constPropertySchema: doCallback,
    stringSchema: doCallback,
    numberSchema: doCallback,
    booleanSchema: doCallback,
    nullSchema: doCallback,
    arraySchema: (schema, options) => {
        const { pathSegs, mapper } = options;
        doCallback(schema, options);
        if (schema.items) {
            const newPathSegs = pathSegs.concat(['[]']);
            const newOptions = Object.assign({}, options, { pathSegs: newPathSegs });
            mapper(schema.items, newOptions);
        }
    },
    childEntitySchema: (schema, options) => {
        map.objectSchema(schema, options);
    },
    entitySchema: (schema, options) => {
        map.objectSchema(schema, options);
    },
    entityReferenceSchema: (schema, options) => {
        map.objectSchema(schema, options);
    },
    objectSchema: (schema, options) => {
        const { pathSegs, mapper } = options;
        doCallback(schema, options);
        if (is_1.is.object(schema.properties) && !is_1.is.empty(schema.properties)) {
            Object.keys(schema.properties).forEach(key => {
                const newPathSegs = pathSegs.concat([key]);
                const newOptions = Object.assign({}, options, { pathSegs: newPathSegs });
                mapper(schema.properties[key], newOptions);
            });
        }
    },
    refSchema: () => {
        throw Error('Found a $ref - schema should have been normalized!');
    },
    anySchema: () => {
        throw Error('Any type not supported');
    }
};
exports.schemaWalk = (schema, callback) => {
    const mapper = Mapper({ map, predicates: predicates_1.predicates });
    mapper(schema, { callback, pathSegs: [] });
};
//# sourceMappingURL=schema-walk.js.map