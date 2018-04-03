/// <reference types="tv4" />
import * as tv4 from 'tv4';
import { JSONSchema4 } from 'json-schema';
import { IAppSchema } from './predicates/app-schema';
import { IEntitySchema } from './predicates/entity-schema';
export declare const EntitySchema: (schemas: IAppSchema[]) => {
    readonly titles: string[];
    readonly entityTitles: string[];
    readonly enumTitles: string[];
    readonly validator: tv4.TV4;
    readonly entities: IEntitySchema[];
    get: (title: string) => IAppSchema;
    normalize: (title: string) => IAppSchema;
    interfaceSchema: (title: string) => JSONSchema4;
    mongooseSchema: (title: string) => any;
    uniquePropertyNames: (title: string) => string[];
    uploadablePropertyNames: (title: string) => string[];
    filterEntity: <TEntityModel>(title: string, entity: TEntityModel) => TEntityModel;
    parent: (title: string) => string | undefined;
    parentProperty: (title: string) => string | undefined;
};
