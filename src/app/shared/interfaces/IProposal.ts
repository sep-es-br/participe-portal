import { IPlanItem } from './IPlanItem';

export interface IProposal {
    commentid: number;
    time: string;
    comment: string;
    isLiked: boolean;
    personId: number;
    personName: string;
    planItens: IPlanItem[];
    localityTypeName: string;
    localityPerson: string;
    localityName: string;
    localityMicro: string;
    likes?: number;
}
