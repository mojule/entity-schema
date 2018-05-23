export declare const apiKeySchema: {
    id: string;
    title: string;
    description: string;
    type: string;
    format: string;
    properties: {
        user: {
            $ref: string;
        };
        secret: {
            title: string;
            description: string;
            type: string;
            format: string;
            wsSecurity: {
                create: string[];
                read: string[];
                update: string[];
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
