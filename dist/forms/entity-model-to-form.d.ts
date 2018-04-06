import { IEntitySchema } from '../predicates/entity-schema';
import { SchemaFormElement } from './schema-to-form';
export declare const entityModelToForm: <TEntityModel>(document: Document, schema: IEntitySchema, model: TEntityModel) => SchemaFormElement;
