import { IObjectSchema } from './object-schema';
export interface IEntitySchema extends IObjectSchema {
    format: 'workingspec-entity';
}
export declare const isEntitySchema: (value: any) => value is IEntitySchema;
