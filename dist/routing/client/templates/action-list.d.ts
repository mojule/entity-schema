import { AdminTemplateDeps } from './types';
export interface ActionModel {
    title: string;
    path: string;
}
export declare const ActionListTemplate: (deps: AdminTemplateDeps) => (model: ActionModel[]) => HTMLUListElement;
