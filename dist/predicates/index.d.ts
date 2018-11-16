export declare const predicates: {
    oneOfSchema: (value: any) => value is import("./oneof-schema").OneOfSchema;
    constPropertySchema: (value: any) => value is import("./const-property-schema").ConstPropertySchema;
    stringSchema: (value: any) => value is import("./string-schema").StringSchema;
    numberSchema: (value: any) => value is import("./number-schema").NumberSchema;
    integerSchema: (value: any) => value is import("./integer-schema").IntegerSchema;
    booleanSchema: (value: any) => value is import("./boolean-schema").BooleanSchema;
    arraySchema: (value: any) => value is import("./array-schema").ArraySchema;
    childEntitySchema: (value: any) => value is import("./child-entity-schema").ChildEntitySchema;
    entitySchema: (value: any) => value is import("./entity-schema").EntitySchema;
    entityReferenceSchema: (value: any) => value is import("./entity-reference-schema").EntityReferenceSchema;
    objectSchema: (value: any) => value is import("./object-schema").ObjectSchema;
    rootSchema: (value: any) => value is import("./root-schema").RootSchema;
    refSchema: (value: any) => value is import("./ref-schema").RefSchema;
    enumSchema: (value: any) => value is import("./enum-schema").EnumSchema;
    typedSchema: (value: any) => value is import("./typed-schema").TypedSchema;
    subSchema: (value: any) => value is import("./subschema").Subschema;
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
