import { TypedSchema } from './typed-schema';
export interface UniquePropertySchema extends TypedSchema {
    wsUnique: true;
}
export declare const isUniquePropertySchema: (value: any) => value is UniquePropertySchema;
