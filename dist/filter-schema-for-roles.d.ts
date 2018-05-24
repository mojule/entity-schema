import { Role } from './security/types';
import { IAppSchema } from './predicates/app-schema';
export declare const FilterSchemaForRoles: (schema: IAppSchema) => (userRoles: Role[]) => {} | IAppSchema;
