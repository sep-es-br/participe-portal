import { IParentLink } from './IParentLink';

export interface IStructureitem {
  id: number;
  logo: boolean;
  locality: boolean;
  votes: boolean;
  comments: boolean;
  hasNext: boolean;
  name: string;
  title: string;
  subtitle: string;
  parentLink?: IParentLink;
}


