/// <reference types="tv4" />
/// <reference types="mongoose" />
import * as tv4 from 'tv4';
import { JSONSchema4 } from 'json-schema';
import { Schema } from 'mongoose';
import { IAppSchema } from './predicates/app-schema';
import { IEntitySchema } from './predicates/entity-schema';
import { Role } from './security/types';
export declare const SchemaCollection: (schemas: IAppSchema[]) => {
    readonly titles: string[];
    readonly entityTitles: string[];
    readonly enumTitles: string[];
    readonly validator: tv4.TV4;
    readonly entities: IEntitySchema[];
    titlesForRoles: (userRoles: Role[]) => string[];
    get: (title: string) => IAppSchema;
    normalize: (title: string) => IAppSchema;
    interfaceSchema: (title: string) => JSONSchema4;
    mongooseSchema: (title: string) => Schema;
    uniquePropertyNames: (title: string) => string[];
    uploadablePropertyNames: (title: string) => string[];
    filterEntity: <TEntityModel>(title: string, entity: TEntityModel) => TEntityModel;
    parent: (title: string) => string | undefined;
    parentProperty: (title: string) => string | undefined;
    filterForRoles: (title: string, userRoles: Role[], normalize?: boolean) => {} | IEntitySchema;
};
