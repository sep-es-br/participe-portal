import { ISort } from './ISort';

export interface IResultPaginated<T> {
    registros: T[];
    totalRegistros: number;
    totalPaginas: number;
    tamanhoPagina: number;
    pagina: number;
    ordenacao: ISort[];
}


