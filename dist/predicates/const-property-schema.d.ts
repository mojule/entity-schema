import { IWsSchema } from './ws-schema';
export interface IConstPropertySchema extends IWsSchema {
    type: 'string';
    enum: [string];
    readOnly: true;
    default: string;
}
export declare const isConstPropertySchema: (value: any) => value is IConstPropertySchema;
