import { TypedSchema } from './typed-schema';
export interface ConstPropertySchema extends TypedSchema {
    type: 'string';
    enum: [string];
    readOnly: true;
    default: string;
}
export declare const isConstPropertySchema: (value: any) => value is ConstPropertySchema;
