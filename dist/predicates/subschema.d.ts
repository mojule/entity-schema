import { RefSchema } from './ref-schema';
import { TypedSchema } from './typed-schema';
export declare type Subschema = RefSchema | TypedSchema;
export declare const isSubschema: (value: any) => value is Subschema;
