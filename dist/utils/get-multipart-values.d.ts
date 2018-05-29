/// <reference types="node" />
import { Request } from 'express-serve-static-core';
export interface MultipartFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    stream: NodeJS.ReadableStream;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}
export interface MultipartFields {
    [pointer: string]: string;
}
export interface MultipartData {
    fields: MultipartFields;
    files: MultipartFile[];
}
export declare const getMultipartData: (req: Request) => Promise<MultipartData>;
