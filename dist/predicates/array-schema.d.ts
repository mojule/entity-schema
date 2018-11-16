import { Subschema } from './subschema';
import { JSONSchema4 } from 'json-schema';
export interface ArraySchema extends JSONSchema4 {
    type: 'array';
    items?: Subschema;
}
export declare const isArraySchema: (value: any) => value is ArraySchema;
