import { TSubschema } from './subschema';
import { JSONSchema4 } from 'json-schema';
export interface IArraySchema extends JSONSchema4 {
    type: 'array';
    items?: TSubschema;
}
export declare const isArraySchema: (value: any) => value is IArraySchema;
