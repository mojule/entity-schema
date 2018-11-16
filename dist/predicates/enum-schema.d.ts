import { TypedSchema } from './typed-schema';
export interface EnumSchema extends TypedSchema {
    type: 'string';
    enum: string[];
    _esTitles: string[];
}
export declare const isEnumSchema: (value: any) => value is EnumSchema;
