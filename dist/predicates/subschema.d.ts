import { IRefSchema } from './ref-schema';
import { IWsSchema } from './ws-schema';
export declare type TSubschema = IRefSchema | IWsSchema;
export declare const isSubschema: (value: any) => value is TSubschema;
