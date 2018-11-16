import { Role, EntityAccess } from './security/types';
import { RootSchema } from './predicates/root-schema';
export declare const FilterSchemaForRoles: (schema: RootSchema) => (userRoles: Role[], accesses?: EntityAccess[]) => {} | RootSchema;
