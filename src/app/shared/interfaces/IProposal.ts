import { IPlanItem } from './IPlanItem';

export interface IProposal{
    commentid:number;
    comment: string;
    isLiked: boolean;
    personName: string;
    planItens: IPlanItem[];
    localityTypeName: string;
    localityPerson: string;
    localityName: string;
    likes?: number;
}