import { IWsSchema } from './ws-schema';
export interface IEnumSchema extends IWsSchema {
    type: 'string';
    enum: string[];
    wsEnumTitles: string[];
}
export declare const isEnumSchema: (value: any) => value is IEnumSchema;
