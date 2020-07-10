import { IPerson } from './IPerson';

export interface ILoginResult {
  person: IPerson;
  type: string;
  token: string;
  refreshToken: string;
  temporaryPassword: boolean;
  completed: boolean;
}
