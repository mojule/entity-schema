export interface FetchJsonMap {
    [propertyName: string]: string;
}
export interface FetchJsonResult {
    [propertyName: string]: any;
}
export declare const fetchJson: (uri: string, authorize?: string | undefined) => Promise<any>;
export declare const fetchJsonMultiple: (map: FetchJsonMap, authorize?: string | undefined) => Promise<FetchJsonResult>;
export declare const postDelete: (uri: string, authorize?: string | undefined) => Promise<any>;
export declare const postJson: (uri: string, model: any, method?: "POST" | "PUT" | "DELETE", authorize?: string | undefined) => Promise<any>;
export declare const putJson: (uri: string, model: any, authorize?: string | undefined) => Promise<any>;
export declare const postFormData: (uri: string, model: any, method?: "POST" | "PUT", authorize?: string | undefined) => Promise<any>;
export declare const putFormData: (uri: string, model: any, authorize?: string | undefined) => Promise<any>;
