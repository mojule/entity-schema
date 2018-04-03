"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadablePropertyNames = (objectSchema) => {
    const { properties } = objectSchema;
    const propertyNames = Object.keys(properties);
    const uploadablePropertyNames = propertyNames.filter(name => {
        const propertySchema = properties[name];
        return !!propertySchema.wsUploadable;
    });
    return uploadablePropertyNames;
};
//# sourceMappingURL=uploadable-properties.js.map