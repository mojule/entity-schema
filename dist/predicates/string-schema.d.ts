import { JSONSchema4 } from 'json-schema';
export interface StringSchema extends JSONSchema4 {
    type: 'string';
}
export declare const isStringSchema: (value: any) => value is StringSchema;
