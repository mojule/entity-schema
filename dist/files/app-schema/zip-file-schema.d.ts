export declare const zipFileSchema: {
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
};
export declare const zipFileReferenceSchema: {
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
