"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorToObj = (err, includeStack = false) => {
    const { name, message, stack } = err;
    const obj = { name, message };
    if (includeStack)
        obj.stack = stack;
    return obj;
};
//# sourceMappingURL=error-to-object.js.map