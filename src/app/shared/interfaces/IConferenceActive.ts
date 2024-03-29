import { IImage } from './IImage';

export interface ILoginScreenInfo {
  localityType: string;
  showStatistics: Boolean;
  showCalendar: Boolean;
  showStatisticsPanel: Boolean;
  showExternalLinks: Boolean;
  titleAuthentication: string;
  subtitleAuthentication: string;
  fileAuthentication: IImage;
  proposal: number;
  highlights: number;
  participations: number;
  numberOfLocalities: number;
  backgroundImageUrl: IImage;
  calendarImageUrl: any;
  status: string;
  beginDate?: string;
  endDate?: string;
}
