import { IWsSchema } from './ws-schema';
export interface IAppSchema extends IWsSchema {
    id: string;
}
export declare const isAppSchema: (value: any) => value is IAppSchema;
