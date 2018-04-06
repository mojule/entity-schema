import { IH } from '@mojule/h/types';
export interface ArrayifyApi {
    [path: string]: {
        add: () => HTMLLIElement;
        size: () => number;
        remove: (index: number) => HTMLLIElement;
        get: (index: number) => HTMLLIElement;
        reindex: () => void;
    };
}
export declare const arrayifySchemaForm: (schemaFormEl: HTMLFormElement, h: IH) => ArrayifyApi;
