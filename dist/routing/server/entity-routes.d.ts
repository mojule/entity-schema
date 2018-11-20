import { Model, Document } from 'mongoose';
import { IRouteData } from './types';
import { ModelResolverMap } from '../../model-resolvers/types';
import { FileResolverMap } from '../../file-resolvers';
import { EntitySchema, RootSchema } from '@entity-schema/predicates';
export interface EntityRouteOptions {
    modelResolvers?: ModelResolverMap;
    fileResolvers?: FileResolverMap;
}
export interface Metadata {
    Model: Model<Document>;
    model: Document;
    title: string;
    body: any;
    meta: any;
    schema: EntitySchema;
}
export declare const EntityRoutes: (schemaCollection: RootSchema[], options?: EntityRouteOptions) => IRouteData;
