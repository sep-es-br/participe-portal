import {IPerson} from './IPerson';

export interface ISocialLoginResult {
  person: IPerson;
  completed: boolean;
  type: string;
  token: string;
  refreshToken: string;
  authServiceName?: string;
}

export interface ILoginProfileResult {
  loginId: string;
  loginType: string;
  loginEmail: string;
  loginName: string;
  name: string;
  hasRelatedRecord: boolean;
  personIdAlreadyRelated: number;
}
