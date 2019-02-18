import { FilePathBuffers } from '../files/types';
export declare const writeFileBuffers: (rootPath: string, fileBuffers: FilePathBuffers) => Promise<any[]>;
export declare const readFileBuffers: (paths: string[]) => Promise<FilePathBuffers>;
export declare const missingPathsInFileBuffers: (fileBuffers: FilePathBuffers, paths: string[]) => string[];
export declare const hasPathsInFileBuffers: (fileBuffers: FilePathBuffers, paths: string[]) => boolean;
export interface ZipToFileBuffersOptions {
    filter: (fileName: string) => boolean;
    map: (fileName: string) => string;
}
export declare const zipBufferToFileBuffers: (zipFileBuffer: Buffer, options?: ZipToFileBuffersOptions) => Promise<FilePathBuffers>;
export declare const fileBuffersToZipBuffer: (fileBuffers: FilePathBuffers, beforeEnd?: (_zip: any) => Promise<void>) => Promise<Buffer>;
