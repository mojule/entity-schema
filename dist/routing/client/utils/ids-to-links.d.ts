import { AnchorLinkItemModel } from '../templates/anchor-link-item';
export declare const getName: (title: string, id: string) => Promise<string>;
export declare const idsToLinks: (ids: string[], routePrefix: string, current?: string | undefined) => Promise<AnchorLinkItemModel[]>;
