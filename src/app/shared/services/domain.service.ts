import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class DomainService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('domains', injector);
  }
}
