/// <reference types="node" />
export interface FileBuffers {
    [path: string]: Buffer;
}
export declare const writeFileBuffers: (rootPath: string, fileBuffers: FileBuffers) => Promise<any[]>;
