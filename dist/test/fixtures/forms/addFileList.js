"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { JSDOM } = require('jsdom');
const { File, FileList } = (new JSDOM()).window;
exports.createFile = (buffer, name, properties) => new File(buffer, name, properties);
exports.addFileList = (input, files) => {
    files['__proto__'] = Object.create(FileList.prototype);
    Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
    });
    return input;
};
//# sourceMappingURL=addFileList.js.map