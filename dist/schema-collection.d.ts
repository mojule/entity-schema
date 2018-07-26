import { IAppSchema } from './predicates/app-schema';
import { Role, EntityAccess } from './security/types';
import { SchemaCollectionApi } from './types';
export declare const SchemaCollection: (schemas: IAppSchema[], userRoles?: Role[] | undefined, accesses?: EntityAccess[]) => SchemaCollectionApi;
