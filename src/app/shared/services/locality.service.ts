import { IConferenceCards } from './../interfaces/IConferenceCards';
import { ILocalityConference } from './../interfaces/ILocalityConference';
import { environment } from './../../../environments/environment';
import { IResultHttp } from './../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class LocalityService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('localities', injector);
  }

  getAllForConference(conferenceId: number) {
    return this.http.get<IResultHttp<ILocalityConference>>(`${environment.apiUrl}/localities/complement/${conferenceId}`).toPromise();
  }
  getConferenceCards(conferenceId: number) {
    return this.http.get<IResultHttp<IConferenceCards>>(`${environment.apiUrl}/localities/conference/${conferenceId}`).toPromise();
  }

}
