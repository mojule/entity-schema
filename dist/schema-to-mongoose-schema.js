"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validate = require("mongoose-validator");
const is_1 = require("@mojule/is");
const typeMap = {
    string: String,
    number: Number,
    boolean: Boolean,
    array: Array,
    object: Object,
    null: Object,
    any: mongoose_1.Schema.Types.Mixed
};
const stringValidators = (stringSchema, required) => {
    const title = stringSchema.title;
    const validators = [];
    if (is_1.is.number(stringSchema.minLength) || is_1.is.number(stringSchema.maxLength)) {
        const minLength = stringSchema.minLength || 0;
        const maxLength = stringSchema.maxLength || undefined;
        const validator = validate({
            validator: 'isLength',
            arguments: [minLength, maxLength],
            passIfEmpty: !required,
            message: `${title} should be between {ARGS[0]} and {ARGS[1]} characters`
        });
        validators.push(validator);
    }
    if (is_1.is.string(stringSchema.pattern)) {
        const validator = validate({
            validator: 'matches',
            arguments: stringSchema.pattern,
            passIfEmpty: !required,
            message: `${title} should match the pattern {ARGS[0]}`
        });
        validators.push(validator);
    }
    return validators;
};
const propertyToSchemaField = (entitySchema, propertyName) => {
    const propertySchema = entitySchema.properties[propertyName];
    const propertyType = propertySchema.type;
    const type = typeMap[propertyType];
    const required = Array.isArray(entitySchema.required) && entitySchema.required.includes(propertyName);
    const schemaField = { type, required };
    const validators = stringValidators(propertySchema, required);
    if (validators.length)
        Object.assign(schemaField, { validate: validators });
    return schemaField;
};
exports.schemaToMongooseSchema = (entitySchema) => {
    const schemaDefinition = Object.keys(entitySchema.properties).reduce((map, key) => {
        // don't include _id
        if (key === '_id')
            return map;
        const stringValidators = propertyToSchemaField(entitySchema, key);
        map[key] = stringValidators;
        return map;
    }, {});
    const mongooseSchema = new mongoose_1.Schema(schemaDefinition, { timestamps: true });
    return mongooseSchema;
};
//# sourceMappingURL=schema-to-mongoose-schema.js.map