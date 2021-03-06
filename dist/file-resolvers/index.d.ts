/// <reference types="express-serve-static-core" />
/// <reference types="passport" />
import { DiskStorageOptions } from 'multer';
import { Model, Document } from 'mongoose';
export interface ExtendedDiskStorageOptions extends DiskStorageOptions {
    zip?: ((req: Express.Request, file: Express.Multer.File, outPath: string, callback: (error: Error | null, destination: string) => void) => void);
}
export interface FileResolverMap {
    [title: string]: ExtendedDiskStorageOptions;
}
export interface FileMetadata {
    title: string;
    Model: Model<Document>;
    model?: Document;
}
export declare const fileResolvers: FileResolverMap;
