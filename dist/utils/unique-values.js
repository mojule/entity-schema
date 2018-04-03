"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@mojule/is");
exports.uniqueValues = (objects, propertyName) => {
    if (!is_1.is.array(objects) || !objects.every(is_1.is.object))
        throw Error('Expected an array of objects');
    if (!objects.every(obj => propertyName in obj))
        throw Error(`Expected every object to have the property ${propertyName}`);
    const values = new Set(objects.map(obj => obj[propertyName]));
    return values.size === objects.length;
};
//# sourceMappingURL=unique-values.js.map