import { IClientRouterMap } from './client-router';
export interface ClientDependencies {
    resolverNames: string[];
}
export declare const Routes: (deps: ClientDependencies) => IClientRouterMap;
