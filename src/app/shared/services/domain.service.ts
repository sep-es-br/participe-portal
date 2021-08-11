import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';

interface IItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class DomainService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('domains', injector);
  }
}
