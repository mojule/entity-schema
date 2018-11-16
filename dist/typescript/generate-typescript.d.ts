import { RootSchema } from '../predicates/root-schema';
export interface GeneratedFile {
    filename: string;
    contents: string;
}
export interface TypescriptFiles {
    interfaces: GeneratedFile[];
    enums: GeneratedFile[];
}
export declare const generateTypescript: (schemaMap: RootSchema[]) => Promise<TypescriptFiles>;
