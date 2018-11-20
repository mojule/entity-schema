import { SchemaFormElement } from './types';
import { EntitySchema } from '@entity-schema/predicates';
export declare const entityModelToForm: <TEntityModel>(document: Document, schema: EntitySchema, model: TEntityModel) => SchemaFormElement;
