import { RequestHandler } from 'express-serve-static-core';
export interface IRouteHandlers {
    get?: RequestHandler | RequestHandler[];
    post?: RequestHandler | RequestHandler[];
    put?: RequestHandler | RequestHandler[];
    delete?: RequestHandler | RequestHandler[];
}
export interface IRouteData {
    [routePath: string]: IRouteHandlers;
}
