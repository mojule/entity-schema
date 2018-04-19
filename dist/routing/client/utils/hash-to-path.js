"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToPath = (hash) => {
    let path = '/';
    if (hash.length) {
        path = hash.slice(1);
        if (!path.startsWith('/'))
            path = '/' + path;
    }
    return path;
};
//# sourceMappingURL=hash-to-path.js.map