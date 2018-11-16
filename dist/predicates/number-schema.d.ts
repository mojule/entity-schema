import { JSONSchema4 } from 'json-schema';
export interface NumberSchema extends JSONSchema4 {
    type: 'number';
}
export declare const isNumberSchema: (value: any) => value is NumberSchema;
