import { Schema } from 'mongoose';
import { EntitySchema } from './predicates/entity-schema';
export declare const schemaToMongooseSchema: (entitySchema: EntitySchema) => Schema;
