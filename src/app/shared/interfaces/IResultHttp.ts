export interface IResultHttp<T> {
    success: boolean;
    data: T;
    error: any;
}