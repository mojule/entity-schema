import { Request } from 'express-serve-static-core';
import { EntityAccess } from '../security/types';
import { SchemaCollectionApi } from '../types';
import { RootSchema } from '@entity-schema/predicates';
export declare const getUser: (req: Request) => any;
export declare const getUserSchemas: (req: Request, schemas: RootSchema[], accesses: EntityAccess[]) => SchemaCollectionApi;
