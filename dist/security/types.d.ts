/// <reference types="mongoose" />
import { Model, Document } from 'mongoose';
export declare type Role = 'admin' | 'user' | 'currentUser' | 'public';
export interface User {
    email: string;
    password: string;
    roles: Role[];
}
export interface RoleMap {
    [userType: string]: Role;
}
export declare const Roles: RoleMap;
export interface UserDocument extends Document, User {
}
export declare type MongoUser = Model<UserDocument>;
