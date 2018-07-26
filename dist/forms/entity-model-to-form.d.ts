import { IEntitySchema } from '../predicates/entity-schema';
import { SchemaFormElement } from './types';
export declare const entityModelToForm: <TEntityModel>(document: Document, schema: IEntitySchema, model: TEntityModel) => SchemaFormElement;
