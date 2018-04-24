import { IAppSchema } from '../predicates/app-schema';
export interface GeneratedFile {
    filename: string;
    contents: string;
}
export interface TypescriptFiles {
    interfaces: GeneratedFile[];
    enums: GeneratedFile[];
}
export declare const generateTypescript: (schemaMap: IAppSchema[]) => Promise<TypescriptFiles>;
