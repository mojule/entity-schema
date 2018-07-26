/// <reference types="passport" />
import { Request } from 'express-serve-static-core';
import { IAppSchema } from '../predicates/app-schema';
import { EntityAccess } from '../security/types';
import { SchemaCollectionApi } from '../types';
export declare const getUser: (req: Request) => Express.User;
export declare const getUserSchemas: (req: Request, schemas: IAppSchema[], accesses: EntityAccess[]) => SchemaCollectionApi;
