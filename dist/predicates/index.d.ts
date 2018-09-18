export declare const predicates: {
    oneOfSchema: (value: any) => value is import("./oneof-schema").IOneOfSchema;
    constPropertySchema: (value: any) => value is import("./const-property-schema").IConstPropertySchema;
    stringSchema: (value: any) => value is import("./string-schema").IStringSchema;
    numberSchema: (value: any) => value is import("./number-schema").INumberSchema;
    integerSchema: (value: any) => value is import("./integer-schema").IIntegerSchema;
    booleanSchema: (value: any) => value is import("./boolean-schema").IBooleanSchema;
    arraySchema: (value: any) => value is import("./array-schema").IArraySchema;
    childEntitySchema: (value: any) => value is import("./child-entity-schema").IChildEntitySchema;
    entitySchema: (value: any) => value is import("./entity-schema").IEntitySchema;
    entityReferenceSchema: (value: any) => value is import("./entity-reference-schema").IEntityReferenceSchema;
    objectSchema: (value: any) => value is import("./object-schema").IObjectSchema;
    appSchema: (value: any) => value is import("./app-schema").IAppSchema;
    refSchema: (value: any) => value is import("./ref-schema").IRefSchema;
    enumSchema: (value: any) => value is import("./enum-schema").IEnumSchema;
    wsSchema: (value: any) => value is import("./ws-schema").IWsSchema;
    subSchema: (value: any) => value is import("./subschema").TSubschema;
    anySchema: (value: any) => value is any;
};
export declare const predicateUtils: {
    isType: (subject: any, typename: string) => boolean;
    isOnly: (subject: any, typename: string) => boolean;
    some: (subject: any, ...typenames: string[]) => boolean;
    every: (subject: any, ...typenames: string[]) => boolean;
    of: (subject: any) => string | undefined;
    allOf: (subject: any) => string[];
    types: () => string[];
};
