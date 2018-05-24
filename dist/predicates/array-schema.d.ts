import { TSubschema } from './subschema';
export interface IArraySchema {
    type: 'array';
    items?: TSubschema;
}
export declare const isArraySchema: (value: any) => value is IArraySchema;
