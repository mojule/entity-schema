import { IWsSchema } from './ws-schema';
import { TSubschema } from './subschema';
export interface IOneOfSchema extends IWsSchema {
    oneOf: TSubschema[];
}
export declare const isOneOfSchema: (value: any) => value is IOneOfSchema;
