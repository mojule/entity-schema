import { IAppSchema } from '../../predicates/app-schema';
import { IRouteData } from './types';
import { ModelResolverMap } from '../../model-resolvers/types';
export declare const EntityRoutes: (schemaCollection: IAppSchema[], resolvers?: ModelResolverMap) => IRouteData;
