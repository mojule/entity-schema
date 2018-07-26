import { ArrayifyApi } from './arrayify-schema-form';
import { OneOfApi } from './oneof-schema-form';
export declare type SchemaFieldEditor = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export declare const ArrayifySymbol: unique symbol;
export declare const OneOfSymbol: unique symbol;
export interface SchemaFormElement extends HTMLFormElement {
    [ ArrayifySymbol ]: ArrayifyApi;
    [ OneOfSymbol ]: OneOfApi;
}
