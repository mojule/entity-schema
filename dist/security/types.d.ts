/// <reference types="mongoose" />
import { Model, Document } from 'mongoose';
export declare type Role = 'admin' | 'user' | 'currentUser' | 'public';
export interface User {
    email: string;
    password: string;
    roles: Role[];
}
export interface ApiKey {
    user: {
        entityId: string;
        entityType: 'User';
    };
    secret: string;
}
export interface RoleMap {
    [userType: string]: Role;
}
export declare const Roles: RoleMap;
export interface UserDocument extends Document, User {
}
export interface ApiKeyDocument extends Document, ApiKey {
}
export declare type MongoUser = Model<UserDocument>;
export declare type MongoApiKey = Model<ApiKeyDocument>;
