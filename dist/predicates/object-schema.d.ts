import { IAppSchema } from './app-schema';
import { TSubschema } from './subschema';
export interface IObjectSchemaProperties {
    [name: string]: TSubschema;
}
export interface IObjectSchema extends IAppSchema {
    type: 'object';
    properties: IObjectSchemaProperties;
    additionalProperties: false;
}
export declare const isObjectSchemaProperties: (value: any) => value is IObjectSchemaProperties;
export declare const isObjectSchema: (value: any) => value is IObjectSchema;
