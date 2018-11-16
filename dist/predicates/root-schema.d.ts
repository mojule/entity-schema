import { TypedSchema } from './typed-schema';
export interface RootSchema extends TypedSchema {
    id: string;
}
export declare const isRootSchema: (value: any) => value is RootSchema;
