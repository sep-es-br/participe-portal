import { Injectable, Inject, Injector } from '@angular/core';
import { IResearch } from '../interfaces/IResearch';
import { IResultHttp } from '../interfaces/IResultHttp';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ResearchService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('research', injector);
  }

  getResearch(conferenceId: number) {
    return this.http.get<IResultHttp<IResearch>>(`${this.urlBase}/${conferenceId}`)
      .toPromise();
  }
}
