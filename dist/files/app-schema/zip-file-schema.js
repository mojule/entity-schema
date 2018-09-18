"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
// TODO - get this back into JSON and think of a more robust way to export it
exports.zipFileSchema = {
    id: 'http://workingspec.com/schema/zip-file',
    title: 'Zip File',
    description: 'A zip file stored on disk',
    type: 'object',
    format: 'workingspec-entity',
    properties: {
        path: common_1.FilePathSchema('zip file'),
        filePaths: {
            title: 'File Paths',
            description: 'List of the paths in this zip',
            type: 'array',
            items: {
                title: 'Path',
                description: "Path to a file in the zip",
                type: 'string'
            }
        },
        tags: common_1.TagsSchema('zip file')
    },
    additionalProperties: false,
    required: ['path']
};
exports.zipFileReferenceSchema = common_1.ReferenceSchema('Zip File');
//# sourceMappingURL=zip-file-schema.js.map