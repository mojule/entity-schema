"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
// TODO - get this back into JSON and think of a more robust way to export it
exports.diskFileSchema = {
    id: 'http://workingspec.com/schema/disk-file',
    title: 'Disk File',
    description: 'A file stored on disk',
    type: 'object',
    format: 'workingspec-entity',
    properties: {
        path: common_1.FilePathSchema('file'),
        meta: common_1.MetaSchema(),
        tags: common_1.TagsSchema('file')
    },
    additionalProperties: false,
    required: ['path', 'meta']
};
//# sourceMappingURL=disk-file-schema.js.map