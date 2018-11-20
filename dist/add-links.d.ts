import { EntitySchema } from '@entity-schema/predicates';
export interface ILink {
    _id: string;
    name: string;
}
export interface ILinkMap {
    [entityTitle: string]: ILink[];
}
export declare const addLinks: (schema: EntitySchema, linkMap: ILinkMap) => EntitySchema;
