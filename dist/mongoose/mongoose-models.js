"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schema_collection_1 = require("../schema-collection");
const pascal_case_1 = require("../utils/pascal-case");
exports.mongooseModels = (schemaMap) => {
    const appSchemas = schema_collection_1.SchemaCollection(schemaMap);
    const createCtor = (title) => {
        const parentProperty = appSchemas.parentProperty(title);
        const schema = appSchemas.mongooseSchema(title);
        const ctorName = pascal_case_1.pascalCase(title);
        schema.statics.uniquePropertyNames = () => appSchemas.uniquePropertyNames(title);
        schema.statics.valuesForUniqueProperty = async function (propertyName, parentId) {
            const uniques = appSchemas.uniquePropertyNames(title);
            if (!uniques.includes(propertyName))
                throw Error(`${propertyName} is not a unique property`);
            const model = this.model(ctorName);
            let condition = {};
            if (parentProperty && parentId) {
                condition[parentProperty] = parentId;
            }
            const docs = await model.find(condition, propertyName).exec();
            const values = docs.map(doc => doc[propertyName]);
            return values;
        };
        schema.statics.uniqueValuesMap = async function (parentId) {
            const result = {};
            const names = appSchemas.uniquePropertyNames(title);
            return Promise.all(names.map(propertyName => {
                const model = this.model(ctorName);
                return model.valuesForUniqueProperty(propertyName, parentId)
                    .then(values => {
                    return { propertyName, values };
                });
            }))
                .then(values => {
                return values.reduce((map, value) => {
                    const { propertyName, values } = value;
                    map[propertyName] = values;
                    return map;
                }, {});
            });
        };
        return mongoose.model(ctorName, schema);
    };
    return appSchemas.entityTitles.reduce((models, title) => {
        const ctorName = pascal_case_1.pascalCase(title);
        const Ctor = mongoose.models[ctorName] || createCtor(title);
        models[ctorName] = Ctor;
        return models;
    }, {});
};
//# sourceMappingURL=mongoose-models.js.map