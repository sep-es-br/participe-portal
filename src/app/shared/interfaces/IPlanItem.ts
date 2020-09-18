export interface IPlanItem{
    id: number;
    name: string;
    parent?: IPlanItem;
    structureItemName?: string;
    fileName?: string;
    description?: string;
}
