import { ActionModel } from './action-list';
import { AnchorLinkItemModel } from './anchor-link-item';
import { AppPageModel } from './app-page';
export declare const ActionList: (model: ActionModel[]) => HTMLUListElement;
export declare const AnchorLinkItem: (model: AnchorLinkItemModel) => HTMLLIElement;
export declare const AppPage: (model?: AppPageModel, ...childNodes: Node[]) => DocumentFragment;
export declare const ErrorPage: (model: Error) => DocumentFragment;
export declare const TitlesAnchorNav: (model: AnchorLinkItemModel[]) => HTMLElement;
