import { JSONSchema4 } from 'json-schema';
export interface BooleanSchema extends JSONSchema4 {
    type: 'boolean';
}
export declare const isBooleanSchema: (value: any) => value is BooleanSchema;
