"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
// TODO - get this back into JSON and think of a more robust way to export it
exports.zipFileSchema = {
    id: 'http://workingspec.com/schema/zip-file',
    title: 'Zip File',
    description: 'A zip file stored on disk',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            title: 'Name',
            type: 'string',
            description: 'The name of the zip file'
        },
        path: common_1.FilePathSchema('zip file'),
        meta: common_1.MetaSchema(),
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
    required: ['name', 'path', 'meta', 'filePaths']
};
exports.zipFileReferenceSchema = common_1.ReferenceSchema('Zip File');
//# sourceMappingURL=zip-file-schema.js.map