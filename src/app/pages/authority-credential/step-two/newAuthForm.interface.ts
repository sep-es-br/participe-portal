export interface INewAuthForm {
    id: number;
    sub: string;
    name: string;
    organization: string;
    representing: 'himself' | 'other' | 'none';
    authorityCpf: string;
    authorityEmail: string;
    authorityRepresenting: string;
    authorityRole: string;
    notRepresentingReason: string;
}
