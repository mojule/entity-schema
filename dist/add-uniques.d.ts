import { EntitySchema } from '@entity-schema/predicates';
export interface IExistingValuesMap {
    [propertyName: string]: string[];
}
export declare const addUniques: (schema: EntitySchema, existingValues: IExistingValuesMap) => EntitySchema;
