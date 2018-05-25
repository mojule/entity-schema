import { IEntitySchema } from '../predicates/entity-schema';
export declare const securitySchemas: (IEntitySchema | {
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
})[];
