import { AdminTemplateDeps } from './types';
export interface TitlesAnchorNavModel {
    routePrefix?: string;
    titles: string[];
    currentTitle?: string;
}
export declare const TitlesAnchorNavTemplate: (deps: AdminTemplateDeps) => (model: TitlesAnchorNavModel) => HTMLElement;
