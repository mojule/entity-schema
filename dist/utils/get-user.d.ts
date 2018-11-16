import { Request } from 'express-serve-static-core';
import { RootSchema } from '../predicates/root-schema';
import { EntityAccess } from '../security/types';
import { SchemaCollectionApi } from '../types';
export declare const getUser: (req: Request) => any;
export declare const getUserSchemas: (req: Request, schemas: RootSchema[], accesses: EntityAccess[]) => SchemaCollectionApi;
