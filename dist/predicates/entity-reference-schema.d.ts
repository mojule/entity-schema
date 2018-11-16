import { TypedSchema } from './typed-schema';
import { ConstPropertySchema } from './const-property-schema';
export interface EntityIdSchema extends TypedSchema {
    type: 'string';
    pattern: '^[0-9a-f]{24}$';
}
export interface EntityReferenceSchema extends TypedSchema {
    type: 'object';
    properties: {
        entityId: EntityIdSchema;
        entityType: ConstPropertySchema;
    };
}
export declare const isEntityIdSchema: (value: any) => value is EntityIdSchema;
export declare const isEntityReferenceSchema: (value: any) => value is EntityReferenceSchema;
