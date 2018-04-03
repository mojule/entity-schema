import { JSONSchema4 } from 'json-schema';
export declare type WsSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
export interface IWsSchema extends JSONSchema4 {
    title: string;
    type: WsSchemaType;
}
export declare const isWsSchema: (value: any) => value is IWsSchema;
