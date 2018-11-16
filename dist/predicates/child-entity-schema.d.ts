import { EntitySchema } from './entity-schema';
export interface ChildEntitySchema extends EntitySchema {
    _esParentKey: string;
}
export declare const isChildEntitySchema: (value: any) => value is ChildEntitySchema;
