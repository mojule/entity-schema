import { IEntitySchema } from './predicates/entity-schema';
export interface IExistingValuesMap {
    [propertyName: string]: string[];
}
export declare const addUniques: (schema: IEntitySchema, existingValues: IExistingValuesMap) => IEntitySchema;
