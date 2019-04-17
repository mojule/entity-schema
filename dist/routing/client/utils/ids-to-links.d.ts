import { AnchorLinkItemModel } from '../templates/anchor-link-item';
export declare const getSchemaTitle: (title: string) => Promise<string>;
export declare const getEntityName: (type: string, id: string) => Promise<string>;
export declare const getSchemaTitles: (titles: string[]) => Promise<string[]>;
export declare const getEntityNames: (type: string, ids: string[]) => Promise<string[]>;
export declare const schemaNamesToLinks: (names: string[], current?: string | undefined) => Promise<AnchorLinkItemModel[]>;
export declare const entityTypesToLinks: (types: string[], routePrefix: string, current?: string | undefined) => Promise<AnchorLinkItemModel[]>;
export declare const entityIdsForTypeToLinks: (ids: string[], routePrefix: string, type: string, current?: string | undefined) => Promise<AnchorLinkItemModel[]>;
