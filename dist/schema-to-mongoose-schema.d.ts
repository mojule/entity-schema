import { Schema } from 'mongoose';
import { EntitySchema } from '@entity-schema/predicates';
export declare const schemaToMongooseSchema: (entitySchema: EntitySchema) => Schema;
