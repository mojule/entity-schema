import { Response } from 'express-serve-static-core';
export declare const jsonError: (res: Response, err: Error | IServerError, status?: number | undefined) => void;
export declare const notFoundError: (res: Response, err: Error) => void;
export declare const serverError: (res: Response, err: Error) => void;
export declare const userError: (res: Response, err: Error) => void;
export interface IServerError extends Error {
    code: number;
}
export declare class NotFoundError extends Error implements IServerError {
    code: number;
    constructor(message: string);
}
export declare class UserError extends Error implements IServerError {
    code: number;
    constructor(message: string);
}
