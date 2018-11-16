import { JSONSchema4 } from 'json-schema';
import { RootSchema } from './predicates/root-schema';
export interface ISchemaMap {
    [id: string]: JSONSchema4;
}
export interface IAppSchemaMap extends ISchemaMap {
    [id: string]: RootSchema;
}
export declare const SchemaMap: (schemas: JSONSchema4[]) => ISchemaMap;
