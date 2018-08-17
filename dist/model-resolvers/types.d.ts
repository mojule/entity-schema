import { Document } from 'mongoose';
import { Request, Response } from 'express-serve-static-core';
import { EntityAccess } from '../security/types';
export declare type ModelResolverResult = {
    document: Document;
    meta?: any;
};
export declare type ModelResolver = (access: EntityAccess, document: Document, model: any, req: Request, res: Response) => Promise<ModelResolverResult>;
export interface ModelResolverMap {
    [title: string]: ModelResolver;
}
