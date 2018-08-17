/// <reference types="node" />
export interface FileMeta {
    filename: string;
    mimetype: string;
    size: number;
}
export interface ImageMeta extends FileMeta {
    width: number;
    height: number;
}
export interface DiskFile {
    path: string;
    meta: FileMeta;
}
export interface ZipFile extends DiskFile {
    filePaths?: string[];
}
export interface FilePathBuffers {
    [path: string]: Buffer;
}
