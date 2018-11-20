"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disk_file_schema_1 = require("./app-schema/disk-file-schema");
const zip_file_schema_1 = require("./app-schema/zip-file-schema");
const image_file_schema_1 = require("./app-schema/image-file-schema");
exports.fileSchemas = [
    disk_file_schema_1.diskFileSchema, image_file_schema_1.imageFileSchema, zip_file_schema_1.zipFileSchema
];
//# sourceMappingURL=schemas.js.map