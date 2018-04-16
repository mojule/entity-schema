export interface JsonPointerMap {
    [pointer: string]: string | number | boolean | any[];
}
export declare const arrayPointerInfo: (map: JsonPointerMap) => {
    [pointer: string]: number;
};
