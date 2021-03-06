export declare type ClientRequestHandler = (req: IClientRouteRequest, res: IClientRouteResponse) => void;
export interface IClientRouteRequest {
    path: string;
    params: any;
}
export interface IClientRouteResponse {
    send: (node: Node) => void;
    redirect: (path: string) => void;
}
export interface IClientRouterMap {
    [route: string]: ClientRequestHandler;
}
export declare const ClientRouter: (routeMap: IClientRouterMap, send: (node: Node) => void, redirect: (path: string) => void) => (path: string) => void;
