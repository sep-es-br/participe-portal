import { ILocalityChildren } from './ILocalityChildren';
import { IItem } from './IItem'

export interface IProposalFilters{
    regionName: string;
    itemName: string;
    itens: IItem[];
    localities: ILocalityChildren[];
}