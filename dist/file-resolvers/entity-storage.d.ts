/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
/// <reference types="passport" />
import { FileResolverMap } from '.';
export declare type GetDestinationFn = (req: Express.Request, file: Express.Multer.File, cb: (error: null | Error, destination: string) => void) => void;
export declare const EntityStorage: (fileResolvers: FileResolverMap) => {
    getDestination: GetDestinationFn;
    _handleFile: (req: Express.Request, file: Express.Multer.File, cb: any) => void;
    _removeFile: (req: Express.Request, file: Express.Multer.File, cb: any) => void;
};
