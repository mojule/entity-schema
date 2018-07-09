import { JSONSchema4 } from '../../node_modules/@types/json-schema';
export interface IStringSchema extends JSONSchema4 {
    type: 'string';
}
export declare const isStringSchema: (value: any) => value is IStringSchema;
