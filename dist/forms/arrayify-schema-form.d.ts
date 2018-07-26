import { IH } from '@mojule/h/types';
import { SchemaFormElement } from './types';
export interface ArrayifyApi {
    [path: string]: {
        add: () => HTMLLIElement;
        size: () => number;
        remove: (index: number) => HTMLLIElement;
        get: (index: number) => HTMLLIElement;
        reindex: () => void;
    };
}
export declare const arrayifySchemaForm: (schemaFormEl: SchemaFormElement, h: IH) => ArrayifyApi;
