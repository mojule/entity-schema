import { AdminTemplateDeps } from './types';
export interface AnchorLinkItemModel {
    path: string;
    title: string;
    isCurrent?: boolean;
}
export declare const AnchorLinkItemTemplate: (deps: AdminTemplateDeps) => (model: AnchorLinkItemModel) => HTMLLIElement;
