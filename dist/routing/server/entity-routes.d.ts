/// <reference types="mongoose" />
import { Model, Document } from 'mongoose';
import { IEntitySchema } from '../../predicates/entity-schema';
import { IAppSchema } from '../../predicates/app-schema';
import { IRouteData } from './types';
import { ModelResolverMap } from '../../model-resolvers/types';
import { FileResolverMap } from '../../file-resolvers';
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
    schema: IEntitySchema;
}
export declare const EntityRoutes: (schemaCollection: IAppSchema[], options?: EntityRouteOptions) => IRouteData;
