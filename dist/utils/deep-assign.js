"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_pointer_1 = require("@mojule/json-pointer");
exports.deepAssign = (...values) => {
    if (!values.length)
        return;
    const pointerMap = {};
    while (values.length)
        Object.assign(pointerMap, json_pointer_1.flatten(values.shift()));
    return json_pointer_1.expand(pointerMap);
};
//# sourceMappingURL=deep-assign.js.map