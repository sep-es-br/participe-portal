import { IProposal } from './IProposal';

export interface IProposals {
    proposals: IProposal[];
    regionalization: boolean;
    totalPages: number;
}
