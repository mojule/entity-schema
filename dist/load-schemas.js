"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Consider making async - but we use in scenarios where you would typically
  use require(), which is synchronous anyway, so no big deal
*/
const fs = require("fs");
const path = require("path");
const schemaFilePredicate = filename => filename.endsWith('.schema.json');
const directoryPredicate = (filename, currentPath) => {
    const stats = fs.lstatSync(path.join(currentPath, filename));
    return stats.isDirectory();
};
const schemaCache = new Map();
exports.loadSchemas = (schemaPath) => {
    if (schemaCache.has(schemaPath))
        return schemaCache.get(schemaPath);
    const schemas = [];
    const files = fs.readdirSync(schemaPath);
    files.forEach(filename => {
        if (schemaFilePredicate(filename)) {
            const filePath = path.join(schemaPath, filename);
            const json = fs.readFileSync(filePath, 'utf8');
            const schema = JSON.parse(json);
            schemas.push(schema);
        }
        else if (directoryPredicate(filename, schemaPath)) {
            const newPath = path.join(schemaPath, filename);
            const directorySchemas = exports.loadSchemas(newPath);
            schemas.push(...directorySchemas);
        }
    });
    schemaCache.set(schemaPath, schemas);
    return schemas;
};
//# sourceMappingURL=load-schemas.js.map