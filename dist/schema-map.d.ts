import { JSONSchema4 } from 'json-schema';
import { IAppSchema } from './predicates/app-schema';
export interface ISchemaMap {
    [id: string]: JSONSchema4;
}
export interface IAppSchemaMap extends ISchemaMap {
    [id: string]: IAppSchema;
}
export declare const SchemaMap: (schemas: JSONSchema4[]) => ISchemaMap;
