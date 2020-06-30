import { environment } from './../../../environments/environment';
import { IResultHttp } from './../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';
import { ILoginScreenInfo } from '../interfaces/IConferenceActive';
import { StoreKeys } from '../commons/contants';

@Injectable({ providedIn: 'root' })
export class ConferenceService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('conference', injector);
  }

  getConferenceScreenInfo(conferenceId: number) {
    return this.http.get<IResultHttp<ILoginScreenInfo>>(
      `${environment.apiUrl}/conferences/AuthenticationScreen/${conferenceId}`
    ).toPromise();
  }

  get ConferenceActiveId(): number {
    try {
      return Number(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE));
    } catch (error) {
      return 0;
    }
  }

}
