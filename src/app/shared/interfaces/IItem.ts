import { IComments } from './IComments';

export interface IItem {
  id: number;
  name: string;
  description: string;
  image: string;
  votes: boolean;
  commentsMade: number;
  comments: IComments[];

  checked: boolean;
  comment: string;
}
