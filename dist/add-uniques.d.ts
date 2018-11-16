import { EntitySchema } from './predicates/entity-schema';
export interface IExistingValuesMap {
    [propertyName: string]: string[];
}
export declare const addUniques: (schema: EntitySchema, existingValues: IExistingValuesMap) => EntitySchema;
