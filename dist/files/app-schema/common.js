"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const defaultFileType = 'file';
const defaultTagType = 'item';
exports.FilePathSchema = (fileType = defaultFileType) => ({
    id: 'http://workingspec.com/schema/file-path',
    title: 'Path',
    description: `Path to this ${fileType}`,
    type: 'string'
});
exports.TagsSchema = (tagType = defaultTagType) => ({
    id: 'http://workingspec.com/schema/tags',
    title: 'Tags',
    description: `Tags to help categorize this ${tagType}`,
    type: 'array',
    items: {
        title: 'Tag',
        description: `Tag for categorizing this ${tagType}`,
        type: 'string'
    }
});
exports.MetaSchema = () => ({
    id: 'http://workingspec.com/schema/file-meta',
    title: 'File Meta',
    description: 'Metadata about the file',
    type: 'object',
    properties: {
        filename: {
            title: 'Filename',
            description: 'The name of the file',
            type: 'string'
        },
        mimetype: {
            title: 'Mime Type',
            description: 'The mime type of the file',
            type: 'string'
        },
        size: {
            title: 'Size',
            description: 'The size of the file in bytes',
            type: 'integer'
        }
    },
    required: ['filename', 'mimetype', 'size']
});
exports.ImageMetaSchema = () => ({
    id: 'http://workingspec.com/schema/image-file-meta',
    title: 'Image File Meta',
    description: 'Metadata about the image file',
    type: 'object',
    properties: {
        filename: {
            title: 'Filename',
            description: 'The name of the image file',
            type: 'string'
        },
        mimetype: {
            title: 'Mime Type',
            description: 'The mime type of the image file',
            type: 'string'
        },
        size: {
            title: 'Size',
            description: 'The size of the image file in bytes',
            type: 'integer'
        },
        width: {
            title: 'Width',
            description: 'The width of the image file',
            type: 'integer'
        },
        height: {
            title: 'Height',
            description: 'The height of the image file',
            type: 'integer'
        }
    },
    required: ['filename', 'mimetype', 'size', 'width', 'height']
});
exports.ReferenceSchema = (title) => ({
    id: `http://workingspec.com/schema/${lodash_1.kebabCase(title)}-reference`,
    title: `${title} Reference`,
    description: `Links to a ${title}`,
    type: `object`,
    properties: {
        entityId: {
            title,
            type: `string`,
            pattern: `^[0-9a-f]{24}$`,
            message: `${title} must be a 24 character hex string. (0-9, a-f)`
        },
        entityType: {
            title: `Entity Type`,
            type: `string`,
            enum: [title],
            readOnly: true,
            default: title
        }
    },
    required: [`entityId`, `entityType`],
    additionalProperties: false
});
//# sourceMappingURL=common.js.map