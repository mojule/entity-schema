import { JSONSchema4 } from 'json-schema';
export interface IntegerSchema extends JSONSchema4 {
    type: 'integer';
}
export declare const isIntegerSchema: (value: any) => value is IntegerSchema;
