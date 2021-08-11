import { IResearch } from './IResearch';

export interface IParticipationHeader {
  image: string;
  title: string;
  subtitle: string;
  answerSurvey: boolean;
  research: IResearch;
}
