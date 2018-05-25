/// <reference types="passport" />
/// <reference types="tv4" />
/// <reference types="mongoose" />
import { Request } from 'express-serve-static-core';
import { IAppSchema } from '../predicates/app-schema';
import { EntityAccess } from '../security/types';
import { IEntitySchema } from '../predicates/entity-schema';
import { JSONSchema4 } from 'json-schema';
import { Schema } from 'mongoose';
import { TV4 } from 'tv4';
export declare const getUser: (req: Request) => Express.User;
export declare const getUserSchemas: (req: Request, schemas: IAppSchema[], accesses: EntityAccess[]) => {
    readonly titles: string[];
    readonly entityTitles: string[];
    readonly enumTitles: string[];
    readonly validator: TV4;
    readonly entities: IEntitySchema[];
    readonly map: any;
    get: (title: string) => IAppSchema;
    normalize: (title: string) => IAppSchema;
    interfaceSchema: (title: string) => JSONSchema4;
    mongooseSchema: (title: string) => Schema;
    uniquePropertyNames: (title: string) => string[];
    uploadablePropertyNames: (title: string) => string[];
    filterEntity: <TEntityModel>(title: string, entity: TEntityModel) => TEntityModel;
    parent: (title: string) => string | undefined;
    parentProperty: (title: string) => string | undefined;
};
