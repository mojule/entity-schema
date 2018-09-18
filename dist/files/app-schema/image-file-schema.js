"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
// TODO - get this back into JSON and think of a more robust way to export it
exports.imageFileSchema = {
    id: 'http://workingspec.com/schema/image-file',
    title: 'Image File',
    description: 'An image file stored on disk',
    type: 'object',
    format: 'workingspec-entity',
    properties: {
        name: {
            title: 'Name',
            type: 'string',
            description: 'The name of the image file'
        },
        path: common_1.FilePathSchema('image file'),
        meta: common_1.ImageMetaSchema(),
        tags: common_1.TagsSchema('image file')
    },
    additionalProperties: false,
    required: ['name', 'path', 'meta']
};
exports.imageFileReferenceSchema = common_1.ReferenceSchema('Image File');
//# sourceMappingURL=image-file-schema.js.map