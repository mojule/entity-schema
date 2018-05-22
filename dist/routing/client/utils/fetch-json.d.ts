export interface FetchJsonMap {
    [propertyName: string]: string;
}
export interface FetchJsonResult {
    [propertyName: string]: any;
}
export declare const fetchJson: (uri: any) => Promise<any>;
export declare const fetchJsonMultiple: (map: FetchJsonMap) => Promise<FetchJsonResult>;
export declare const postDelete: (uri: string) => Promise<any>;
export declare const postJson: (uri: string, model: any, method?: "POST" | "PUT") => Promise<any>;
export declare const putJson: (uri: string, model: any) => Promise<any>;
export declare const postFormData: (uri: string, model: any, method?: "POST" | "PUT") => Promise<any>;
export declare const putFormData: (uri: string, model: any) => Promise<any>;
