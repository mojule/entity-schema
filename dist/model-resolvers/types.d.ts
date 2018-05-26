/// <reference types="mongoose" />
import { MongooseDocument } from 'mongoose';
import { Request, Response } from 'express-serve-static-core';
import { EntityAccess } from '../security/types';
export declare type ModelResolverResult = {
    document: MongooseDocument;
    meta?: any;
};
export declare type ModelResolver = (access: EntityAccess, document: MongooseDocument, model, req: Request, res: Response) => Promise<ModelResolverResult>;
export interface ModelResolverMap {
    [title: string]: ModelResolver;
}
