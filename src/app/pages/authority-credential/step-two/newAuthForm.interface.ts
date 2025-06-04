export interface INewAuthForm {
    id: number;
    sub: string;
    name: string;
    organization: string;
    representing: 'himself' | 'other' | 'none';
    authorityCpf: string;
    authorityEmail: string;
    authorityLocalityId: number;
    authorityRepresenting: string;
    authorityRole: string;
    notRepresentingReason: string;
    madeBy: number;
}
