"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.ensureParentFolders = (targetPath) => {
    const full = path.posix.resolve('/', targetPath);
    const parsed = path.posix.parse(full);
    const { dir } = parsed;
    const segs = dir.split('/').filter(s => s !== '');
    const parents = [];
    const { length } = segs;
    for (let i = 0; i < length; i++) {
        const currentPath = segs.slice(0, i + 1);
        parents.push(currentPath.join('/'));
    }
    exports.ensureDirectories(...parents);
};
exports.ensureDirectories = (...paths) => {
    paths.forEach(current => {
        if (!fs.existsSync(current)) {
            fs.mkdirSync(current);
        }
    });
};
//# sourceMappingURL=ensure-directories.js.map