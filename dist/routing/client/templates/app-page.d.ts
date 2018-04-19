import { AdminTemplateDeps } from './types';
export interface AppPageModel {
    currentPath?: string;
}
export declare const AppPageTemplate: (deps: AdminTemplateDeps) => (model?: AppPageModel, ...childNodes: Node[]) => DocumentFragment;
