import {IOptionOrganization} from "../../../shared/interfaces/IOptionOrganization";

export interface INewAuthForm {
    id: number;
    name: string;
    organization: IOptionOrganization;
    representing: 'himself' | 'other' | 'none';
    authorityCpf: string;
    authoritySub: string;
    authorityEmail: string;
    authorityLocalityId: number;
    authorityRepresenting: string;
    authorityRole: string;
    notRepresentingReason: string;
    madeBy: number;
}
