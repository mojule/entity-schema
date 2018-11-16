import { ObjectSchema } from './object-schema';
export interface EntitySchema extends ObjectSchema {
    format: 'entity-schema';
}
export declare const isEntitySchema: (value: any) => value is EntitySchema;
