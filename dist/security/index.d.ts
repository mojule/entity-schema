/// <reference types="mongoose" />
import { Model } from 'mongoose';
import { UserDocument } from './types';
export declare const PassportSecurity: (User: Model<UserDocument>) => {
    strategy: (email: any, password: any, done: any) => void;
    serializeUser: (user: UserDocument, cb: any) => void;
    deserializeUser: (id: any, cb: any) => void;
};
