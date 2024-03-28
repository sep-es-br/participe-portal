import { IImage } from './IImage';

export interface ILoginScreenInfo {
  localityType: string;
  showStatistics: boolean;
  showCalendar: boolean;
  showStatisticsPanel: boolean;
  showExternalLinks: boolean;
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
