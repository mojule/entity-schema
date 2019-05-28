import { Schema } from 'mongoose';
import { IEntitySchema } from './predicates/entity-schema';
export declare const schemaToMongooseSchema: (entitySchema: IEntitySchema) => Schema<any>;
