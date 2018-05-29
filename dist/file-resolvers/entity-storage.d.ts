/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
/// <reference types="passport" />
import { FileResolverMap } from '.';
export declare type GetDestinationFn = (req: Express.Request, file: Express.Multer.File, cb: (error: null | Error, destination: string) => void) => void;
export interface FileHandlerResult {
    path: string;
    size: number;
}
export declare type FileHandler = (req: Express.Request, file: Express.Multer.File) => Promise<FileHandlerResult>;
export declare const EntityStorage: (fileResolvers: FileResolverMap) => {
    getDestination: GetDestinationFn;
    _handleFile: (req: Express.Request, file: Express.Multer.File, cb: any) => void;
    _removeFile: (req: Express.Request, file: Express.Multer.File, cb: any) => void;
};
