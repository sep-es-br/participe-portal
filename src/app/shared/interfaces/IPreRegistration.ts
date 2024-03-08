import { IPerson } from "./IPerson";
import { IMeetingDetail } from "./IMeetingDetail";

export interface IPreRegistration {
  id?: number;
  person: IPerson;
  meeting: Partial<IMeetingDetail>;
  preRegistation: string;
  qrcode;
}


