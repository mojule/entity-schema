import { TypedSchema } from './typed-schema';
export interface UniquePropertySchema extends TypedSchema {
    _esUnique: true;
}
export declare const isUniquePropertySchema: (value: any) => value is UniquePropertySchema;
