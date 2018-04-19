import { IH } from '@mojule/h/types';
export interface DocumentTemplates {
    [id: string]: () => DocumentFragment;
}
export interface AdminTemplateDeps {
    h: IH;
    documentTemplates: DocumentTemplates;
}
