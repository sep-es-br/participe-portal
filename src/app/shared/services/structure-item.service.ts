import { IResultHttp } from '../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';

interface IItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class StructureItemService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('structure-items', injector);
  }

  listStructureItems(idStructure: number) {
    return this.http.get<IResultHttp<IItem[]>>(
      `${this.urlBase}/list`.concat(`?id=${idStructure}`)).toPromise();
  }

}
