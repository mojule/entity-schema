export declare const apiKeySchema: {
    id: string;
    title: string;
    description: string;
    type: string;
    format: string;
    properties: {
        name: {
            title: string;
            description: string;
            type: string;
        };
        user: {
            $ref: string;
        };
        secret: {
            title: string;
            description: string;
            type: string;
            default: string;
            readOnly: boolean;
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
    wsSecurity: {
        create: string[];
        read: string[];
        update: string[];
        delete: string[];
    };
    additionalProperties: boolean;
    required: string[];
};
