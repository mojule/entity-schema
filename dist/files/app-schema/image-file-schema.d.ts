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
