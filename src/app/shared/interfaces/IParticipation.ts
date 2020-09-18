import { StatusParticipationEnum } from '../enums/StatusParticipationEnum';
import { ILocality } from './ILocality';
import { IPlanItem } from './IPlanItem';

export interface IParticipation {
  id: number;
  text: string;
  status: StatusParticipationEnum;
  planItems: IPlanItem[];
  localityDto: ILocality;
  qtdLiked: number;
  highlight: boolean;
  classification: string;
  time: string;
  moderatorName?: string;
  moderateTime?: string;
  moderated?: boolean;
}
