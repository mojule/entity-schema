"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.ensureDirectories = (...paths) => {
    paths.forEach(current => {
        if (!fs.existsSync(current)) {
            fs.mkdirSync(current);
        }
    });
};
//# sourceMappingURL=ensure-directories.js.map