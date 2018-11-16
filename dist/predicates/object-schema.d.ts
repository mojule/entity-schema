import { RootSchema } from './root-schema';
import { Subschema } from './subschema';
export interface ObjectSchemaProperties {
    [name: string]: Subschema;
}
export interface ObjectSchema extends RootSchema {
    type: 'object';
    properties: ObjectSchemaProperties;
    additionalProperties: false;
}
export declare const isObjectSchemaProperties: (value: any) => value is ObjectSchemaProperties;
export declare const isObjectSchema: (value: any) => value is ObjectSchema;
