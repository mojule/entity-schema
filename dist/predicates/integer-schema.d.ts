import { JSONSchema4 } from 'json-schema';
export interface IIntegerSchema extends JSONSchema4 {
    type: 'integer';
}
export declare const isIntegerSchema: (value: any) => value is IIntegerSchema;
