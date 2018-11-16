import { RootSchema } from './predicates/root-schema';
import { Role, EntityAccess } from './security/types';
import { SchemaCollectionApi } from './types';
export declare const SchemaCollection: (schemas: RootSchema[], userRoles?: Role[] | undefined, accesses?: EntityAccess[]) => SchemaCollectionApi;
