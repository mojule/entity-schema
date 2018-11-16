"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO - get this back into JSON and think of a more robust way to export it
exports.apiKeySchema = {
    id: 'http://workingspec.com/schema/api-key',
    title: 'API Key',
    description: 'Key for accessing the API',
    type: 'object',
    format: 'entity-schema',
    properties: {
        name: {
            title: 'Name',
            description: 'Name of this API Key',
            type: 'string'
        },
        user: {
            $ref: "http://workingspec.com/schema/user-reference"
        },
        secret: {
            title: 'Secret',
            description: 'The API Key Secret',
            type: 'string',
            default: '',
            readOnly: true
        },
        tags: {
            title: 'Tags',
            description: 'Tags to help categorize this API key',
            type: 'array',
            items: {
                title: 'Tag',
                description: "Tag for categorizing API key",
                type: 'string'
            }
        }
    },
    wsSecurity: {
        create: ['admin'],
        read: ['admin'],
        update: ['admin'],
        delete: ['admin']
    },
    additionalProperties: false,
    required: ['user', 'secret']
};
//# sourceMappingURL=api-key-schema.js.map