import { EntitySchema } from '../predicates/entity-schema';
import { SchemaFormElement } from './types';
export declare const entityModelToForm: <TEntityModel>(document: Document, schema: EntitySchema, model: TEntityModel) => SchemaFormElement;
