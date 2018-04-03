import { IWsSchema } from './ws-schema';
import { IConstPropertySchema } from './const-property-schema';
export interface IEntityIdSchema extends IWsSchema {
    type: 'string';
    pattern: '^[0-9a-f]{24}$';
}
export interface IEntityReferenceSchema extends IWsSchema {
    type: 'object';
    properties: {
        entityId: IEntityIdSchema;
        entityType: IConstPropertySchema;
    };
}
export declare const isEntityIdSchema: (value: any) => value is IEntityIdSchema;
export declare const isEntityReferenceSchema: (value: any) => value is IEntityReferenceSchema;
