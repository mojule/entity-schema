import { IAppSchema } from "../../predicates/app-schema";
export declare const FilePathSchema: (fileType?: string) => IAppSchema;
export declare const TagsSchema: (tagType?: string) => IAppSchema;
export declare const MetaSchema: () => IAppSchema;
export declare const ImageMetaSchema: () => IAppSchema;
export declare const ReferenceSchema: (title: string) => IAppSchema;
