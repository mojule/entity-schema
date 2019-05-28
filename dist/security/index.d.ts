/// <reference types="mongoose" />
import { UserDocument, ApiKeyDocument } from './types';
import { Request } from 'express-serve-static-core';
export declare const PassportSecurity: (User: Model<UserDocument, {}>, ApiKey: Model<ApiKeyDocument, {}>) => {
    strategy: (email: any, password: any, done: any) => void;
    apiKeyStrategy: (id: any, secret: any, done: any) => void;
    serializeUser: (user: UserDocument, cb: any) => void;
    deserializeUser: (_id: any, cb: any) => void;
    createApiKey: (user: UserDocument, tags?: string[] | undefined) => Promise<{
        apiKey: string;
        apiKeyId: string;
    }>;
    createSessionApiKey: (user: UserDocument) => Promise<{
        apiKey: string;
        apiKeyId: string;
    }>;
    getSessionApiKey: (req: Request) => Promise<any>;
};
