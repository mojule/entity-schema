import { JSONSchema4 } from '../../node_modules/@types/json-schema';
export interface INumberSchema extends JSONSchema4 {
    type: 'number';
}
export declare const isNumberSchema: (value: any) => value is INumberSchema;
