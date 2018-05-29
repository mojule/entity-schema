"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const pify = require("pify");
const ensure_directories_1 = require("./ensure-directories");
const writeFile = pify(fs.writeFile);
exports.writeFileBuffers = async (rootPath, fileBuffers) => {
    if (rootPath.includes('\\'))
        throw Error('Expected rootPath in posix format');
    const paths = Object.keys(fileBuffers);
    return Promise.all(paths.map(filePath => {
        const buffer = fileBuffers[filePath];
        const writePath = path.posix.join(rootPath, filePath);
        ensure_directories_1.ensureParentFolders(writePath);
        return writeFile(writePath, buffer);
    }));
};
//# sourceMappingURL=write-file-buffers.js.map