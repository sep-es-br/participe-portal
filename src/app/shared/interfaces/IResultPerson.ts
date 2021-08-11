export interface IResultPerson {
  name: string;
  contactEmail: string;
  localityId: number;
  telephone?: string;
  authentications?: IAutentication[];
  receiveInformational: boolean;
}

export interface IOptionsContactEmail {
  email: string;
}

export interface IAutentication {
  idByAuth?: string;
  loginName: string; // Participe|AcessoCidadao|Facebook|Google
  loginEmail: string;
  authenticationType: string; // [participeCpf|participeEmail|oauth]
}
