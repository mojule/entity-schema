import { ObjectSchema } from './object-schema';
export interface EntitySchema extends ObjectSchema {
    format: 'workingspec-entity';
}
export declare const isEntitySchema: (value: any) => value is EntitySchema;
