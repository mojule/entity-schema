/// <reference types="mongoose" />
import { Model } from 'mongoose';
import { UserDocument, ApiKeyDocument } from './types';
export declare const PassportSecurity: (User: Model<UserDocument>, ApiKey: Model<ApiKeyDocument>) => {
    strategy: (email: any, password: any, done: any) => void;
    apiKeyStrategy: (id: any, secret: any, done: any) => void;
    serializeUser: (user: UserDocument, cb: any) => void;
    deserializeUser: (id: any, cb: any) => void;
};
