import { IImage } from './IImage';

export interface ILoginScreenInfo {
  localityType: string;
  titleAuthentication: string;
  subtitleAuthentication: string;
  fileAuthentication: IImage;
  proposal: number;
  highlights: number;
  participations: number;
  numberOfLocalities: number;
  backgroundImageUrl: IImage;
  status: string;
  beginDate?: string;
  endDate?: string;
}
