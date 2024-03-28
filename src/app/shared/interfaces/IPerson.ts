import { ISelfDeclarations } from './ISelfDeclarations';

export interface IPerson {
  id?: number;
  name: string;
  contactEmail: string;
  confirmEmail?: string;
  cpf?: string;
  telephone?: string;
  receiveInformational?: boolean;
  selfDeclaration?: ISelfDeclarations;
}


