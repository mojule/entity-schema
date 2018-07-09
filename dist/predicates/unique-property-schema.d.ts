import { IWsSchema } from './ws-schema';
export interface IUniquePropertySchema extends IWsSchema {
    wsUnique: true;
}
export declare const isUniquePropertySchema: (value: any) => value is IUniquePropertySchema;
