import { IAppSchema } from '../../predicates/app-schema';
import { IRouteData } from './types';
import { ModelResolverMap } from '../../model-resolvers/types';
import { FileResolverMap } from '../../file-resolvers';
export interface EntityRouteOptions {
    modelResolvers?: ModelResolverMap;
    fileResolvers?: FileResolverMap;
}
export declare const EntityRoutes: (schemaCollection: IAppSchema[], options?: EntityRouteOptions) => IRouteData;
