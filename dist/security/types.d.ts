/// <reference types="mongoose" />
import { Model, Document } from 'mongoose';
export declare type Role = 'admin' | 'user' | 'currentUser' | 'public';
export declare type PropertyAccess = 'create' | 'read' | 'update';
export declare type EntityAccess = PropertyAccess | 'delete';
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
export interface EntityAccessMap {
    [access: string]: EntityAccess;
}
export interface PropertyAccessMap {
    [access: string]: PropertyAccess;
}
export declare const Roles: RoleMap;
export declare const PropertyAccesses: PropertyAccessMap;
export declare const EntityAccesses: EntityAccessMap;
export interface UserDocument extends Document, User {
}
export interface ApiKeyDocument extends Document, ApiKey {
}
export declare type MongoUser = Model<UserDocument>;
export declare type MongoApiKey = Model<ApiKeyDocument>;
