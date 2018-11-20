import { Role, EntityAccess } from './security/types';
import { SchemaCollectionApi } from './types';
import { RootSchema } from '@entity-schema/predicates';
export declare const SchemaCollection: (schemas: RootSchema[], userRoles?: Role[] | undefined, accesses?: EntityAccess[]) => SchemaCollectionApi;
