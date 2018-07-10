import { JSONSchema4 } from 'json-schema';
export interface INumberSchema extends JSONSchema4 {
    type: 'number';
}
export declare const isNumberSchema: (value: any) => value is INumberSchema;
