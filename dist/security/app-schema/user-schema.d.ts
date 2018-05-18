export declare const userSchema: {
    id: string;
    title: string;
    description: string;
    type: string;
    format: string;
    properties: {
        email: {
            title: string;
            description: string;
            type: string;
            format: string;
        };
        password: {
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
        roles: {
            title: string;
            description: string;
            type: string;
            items: {
                title: string;
                description: string;
                type: string;
            };
            readOnly: boolean;
            default: string[];
            wsSecurity: {
                create: string[];
                read: string[];
                update: string[];
                delete: string[];
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
