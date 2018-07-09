import { JSONSchema4 } from '../../node_modules/@types/json-schema';
export interface IBooleanSchema extends JSONSchema4 {
    type: 'boolean';
}
export declare const isBooleanSchema: (value: any) => value is IBooleanSchema;
