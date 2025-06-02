import { IPerson } from "./IPerson";
import { IMeetingDetail } from "./IMeetingDetail";

export interface IPreRegistrationAuthority {
  id?: number;
  person: IPerson;
  meeting: Partial<IMeetingDetail>;
  preRegistation: string;
  organization: string;
  role: string;
  qrcode: string;
}


