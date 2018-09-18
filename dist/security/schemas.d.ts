export declare const securitySchemas: (import("../predicates/entity-schema").IEntitySchema | {
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
} | {
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
})[];
