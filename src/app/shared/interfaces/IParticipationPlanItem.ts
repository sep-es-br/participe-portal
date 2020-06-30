import { IStructureitem } from './IStructureitem';
import { IItem } from './IItem';

export interface IParticipationPlanItem {
  itens: IItem[];
  structureitem: IStructureitem;
}