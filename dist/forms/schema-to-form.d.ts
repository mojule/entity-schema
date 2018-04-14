import { IObjectSchema } from '../predicates/object-schema';
import { ArrayifyApi } from './arrayify-schema-form';
import { OneOfApi } from './oneof-schema-form';
export declare const ArrayifySymbol: unique symbol;
export declare const OneOfSymbol: unique symbol;
export interface SchemaFormElement extends HTMLFormElement {
    [ ArrayifySymbol ]: ArrayifyApi;
    [ OneOfSymbol ]: OneOfApi;
}
export declare const schemaToForm: (document: Document, schema: IObjectSchema, arrayify?: boolean) => SchemaFormElement;
