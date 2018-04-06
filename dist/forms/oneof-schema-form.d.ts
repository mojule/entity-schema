import { IH } from '@mojule/h/types';
export interface OneOfApi {
    [path: string]: {
        toggle: () => void;
    };
}
export declare const oneOfSchemaForm: (schemaFormEl: HTMLFormElement, h: IH) => OneOfApi;
