import { Role, EntityAccess } from './security/types';
import { RootSchema } from '@entity-schema/predicates';
export declare const FilterSchemaForRoles: (schema: RootSchema) => (userRoles: Role[], accesses?: EntityAccess[]) => {} | RootSchema;
