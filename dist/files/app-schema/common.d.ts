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
