import { IPagination } from './IPagination';

export interface IResultPaginated<T> {
    content: T[];
    pageable: IPagination;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}


