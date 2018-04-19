export interface IErrorObject {
    name: string;
    message: string;
    stack?: string;
}
export declare const errorToObj: (err: Error, includeStack?: boolean) => IErrorObject;
