export declare const diskFileSchema: {
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
};
export declare const diskFileReferenceSchema: {
    id: string;
    title: string;
    description: string;
    type: string;
    properties: {
        entityId: {
            title: string;
            type: string;
            pattern: string;
            message: string;
        };
        entityType: {
            title: string;
            type: string;
            enum: string[];
            readOnly: boolean;
            default: string;
        };
    };
    required: string[];
    additionalProperties: boolean;
};
