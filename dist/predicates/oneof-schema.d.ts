import { TypedSchema } from './typed-schema';
import { Subschema } from './subschema';
export interface OneOfSchema extends TypedSchema {
    oneOf: Subschema[];
}
export declare const isOneOfSchema: (value: any) => value is OneOfSchema;
