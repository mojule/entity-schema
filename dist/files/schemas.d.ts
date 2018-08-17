export declare const fileSchemas: ({
    id: string;
    title: string;
    description: string;
    type: string;
    format: string;
    properties: {
        path: {
            title: string;
            description: string;
            type: string;
        };
        meta: {
            tile: string;
            descriptions: string;
            type: string;
            properties: {
                filename: {
                    title: string;
                    descriptions: string;
                    type: string;
                };
                mimetype: {
                    title: string;
                    descriptions: string;
                    type: string;
                };
                size: {
                    title: string;
                    descriptions: string;
                    type: string;
                };
            };
            required: string[];
        };
        tags: {
            title: string;
            description: string;
            type: string;
            items: {
                title: string;
                description: string;
                type: string;
            };
        };
    };
    additionalProperties: boolean;
    required: string[];
} | {
    id: string;
    title: string;
    description: string;
    type: string;
    format: string;
    properties: {
        path: {
            title: string;
            description: string;
            type: string;
        };
        filePaths: {
            title: string;
            description: string;
            type: string;
            items: {
                title: string;
                description: string;
                type: string;
            };
        };
        tags: {
            title: string;
            description: string;
            type: string;
            items: {
                title: string;
                description: string;
                type: string;
            };
        };
    };
    additionalProperties: boolean;
    required: string[];
})[];
