import { ILocalityChildren } from './ILocalityChildren';

export interface ILocality {
  id: string | number;
  name?: string;
  mapSplit?: string[];
  children?: ILocalityChildren[];
}
