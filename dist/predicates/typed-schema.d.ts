import { JSONSchema4 } from 'json-schema';
export declare type TypedSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
export interface TypedSchema extends JSONSchema4 {
    title: string;
    type: TypedSchemaType;
}
export declare const isTypedSchema: (value: any) => value is TypedSchema;
