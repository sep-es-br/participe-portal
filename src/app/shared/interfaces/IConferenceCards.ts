import { ILocality } from './ILocality';

export interface IConferenceCards {
  regionalizable: string;
  title: string;
  subtitle: string;
  localities: ILocality[];
}