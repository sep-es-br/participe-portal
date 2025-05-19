export interface INewAuthForm {
    sub: string;
    name: string;
    organization: string,
    representing: 'himself' | 'other' | 'none',
    authorityCpf: string,
    authorityRepresenting: string,
    authorityRole: string,
    notRepresentingReason: string
}