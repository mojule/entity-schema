export interface IFetchJsonMap {
    [propertyName: string]: string;
}
export interface IFetchJsonResult {
    [propertyName: string]: any;
}
export declare const fetchJson: (uri: any) => Promise<any>;
export declare const fetchJsonMultiple: (map: IFetchJsonMap) => Promise<IFetchJsonResult>;
export declare const postJson: (uri: string, model: any, method?: "POST" | "PUT") => Promise<any>;
export declare const putJson: (uri: string, model: any) => Promise<any>;
export declare const postFormData: (uri: string, model: any, method?: "POST" | "PUT") => Promise<any>;
export declare const putFormData: (uri: string, model: any) => Promise<any>;
