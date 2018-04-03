import { IEntitySchema } from './entity-schema';
export interface IChildEntitySchema extends IEntitySchema {
    wsParentProperty: string;
}
export declare const isChildEntitySchema: (value: any) => value is IChildEntitySchema;
