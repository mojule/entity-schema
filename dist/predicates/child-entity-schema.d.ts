import { EntitySchema } from './entity-schema';
export interface ChildEntitySchema extends EntitySchema {
    wsParentProperty: string;
}
export declare const isChildEntitySchema: (value: any) => value is ChildEntitySchema;
