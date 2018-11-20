import { RootSchema } from '@entity-schema/predicates';
export interface GeneratedFile {
    filename: string;
    contents: string;
}
export interface TypescriptFiles {
    interfaces: GeneratedFile[];
    enums: GeneratedFile[];
}
export declare const generateTypescript: (schemaMap: RootSchema[]) => Promise<TypescriptFiles>;
