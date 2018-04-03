"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniquePropertyNames = (entitySchema) => {
    const { properties } = entitySchema;
    const propertyNames = Object.keys(properties);
    const uniqueValuePropertyNames = propertyNames.filter(name => {
        const propertySchema = properties[name];
        return !!propertySchema.wsUnique;
    });
    return uniqueValuePropertyNames;
};
//# sourceMappingURL=unique-properties.js.map