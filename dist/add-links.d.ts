import { IEntitySchema } from './predicates/entity-schema';
export interface ILink {
    _id: string;
    name: string;
}
export interface ILinkMap {
    [entityTitle: string]: ILink[];
}
export declare const addLinks: (schema: IEntitySchema, linkMap: ILinkMap) => IEntitySchema;
