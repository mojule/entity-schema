"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_properties_1 = require("./unique-properties");
const Mapper = require("@mojule/mapper");
const is_1 = require("@mojule/is");
const clone = Mapper();
const isExistingValuesList = (value) => is_1.is.array(value) && value.every(is_1.is.string);
/*
  Remember if this is an existing schema, you should filter its own value out of
  the existingValues before passing them in or it will fail to validate!
*/
exports.addUniques = (schema, existingValues) => {
    schema = clone(schema);
    const uniqueNames = unique_properties_1.uniquePropertyNames(schema);
    const { properties } = schema;
    uniqueNames.forEach(propertyName => {
        const propertySchema = properties[propertyName];
        const values = existingValues[propertyName];
        if (!isExistingValuesList(values))
            throw Error('Expected an array of existing property values');
        propertySchema.not = {
            enum: values
        };
    });
    return schema;
};
//# sourceMappingURL=add-uniques.js.map