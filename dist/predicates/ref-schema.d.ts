import { JSONSchema4 } from 'json-schema';
export interface IRefSchema extends JSONSchema4 {
    $ref: string;
}
export declare const isRefSchema: (value: any) => value is IRefSchema;
