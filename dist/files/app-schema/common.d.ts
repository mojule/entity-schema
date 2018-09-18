export declare const FilePathSchema: (fileType?: string) => {
    title: string;
    description: string;
    type: string;
};
export declare const TagsSchema: (tagType?: string) => {
    title: string;
    description: string;
    type: string;
    items: {
        title: string;
        description: string;
        type: string;
    };
};
export declare const MetaSchema: () => {
    tile: string;
    descriptions: string;
    type: string;
    properties: {
        filename: {
            title: string;
            descriptions: string;
            type: string;
        };
        mimetype: {
            title: string;
            descriptions: string;
            type: string;
        };
        size: {
            title: string;
            descriptions: string;
            type: string;
        };
    };
    required: string[];
};
export declare const ReferenceSchema: (title: string) => {
    id: string;
    title: string;
    description: string;
    type: string;
    properties: {
        entityId: {
            title: string;
            type: string;
            pattern: string;
            message: string;
        };
        entityType: {
            title: string;
            type: string;
            enum: string[];
            readOnly: boolean;
            default: string;
        };
    };
    required: string[];
    additionalProperties: boolean;
};
