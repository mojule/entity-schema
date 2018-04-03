import { JSONSchema4 } from 'json-schema';
export declare type SchemaMapper = (from: JSONSchema4) => JSONSchema4;
export declare type SchemaResolver = (id: string) => JSONSchema4;
