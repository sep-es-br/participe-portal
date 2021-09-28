import {environment} from '../../../environments/environment';
import {IResultHttp} from '../interfaces/IResultHttp';
import {Inject, Injectable, Injector} from '@angular/core';
import {BaseService} from './base.service';
import {ILoginScreenInfo} from '../interfaces/IConferenceActive';
import {StoreKeys} from '../commons/contants';
import {IPreOpeningScreenInfo} from '../interfaces/IConferencePreOpeningScreenInfo';
import {IPostClosureScreenInfo} from '../interfaces/IConferencePostClosureScreenInfo';
import {IResultRegionalizationConference} from '../interfaces/IResultRegionalizationConference';
import {IConference} from '../interfaces/IConference';

@Injectable({providedIn: 'root'})
export class ConferenceService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('conferences', injector);
  }

  get ConferenceActiveId(): number {
    try {
      return Number(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE));
    } catch (error) {
      return 0;
    }
  }

  async getConferenceScreenInfo(conferenceId: number) {
    return this.http.get<IResultHttp<ILoginScreenInfo>>(
      `${environment.apiUrl}/conferences/AuthenticationScreen/${conferenceId}`).toPromise();
  }

  async getConferencePreOpeningScreenInfo(conferenceId: number) {
    return this.http.get<IResultHttp<IPreOpeningScreenInfo>>(
      `${environment.apiUrl}/conferences/AuthenticationScreen/${conferenceId}/pre-opening`).toPromise();
  }

  async getConferencePostClosureScreenInfo(conferenceId: number) {
    return this.http.get<IResultHttp<IPostClosureScreenInfo>>(
      `${environment.apiUrl}/conferences/AuthenticationScreen/${conferenceId}/post-closure`).toPromise();
  }

  async getRegionalization(conferenceId: number) {
    return this.http.get<IResultHttp<IResultRegionalizationConference>>(
      `${environment.apiUrl}/conferences/${conferenceId}/regionalization`
    ).toPromise();
  }

  public async GetByUrl(url: string): Promise<IResultHttp<IConference>> {
    const result = await this.http.get(`${this.urlBase}/portal?url=` + url).toPromise();
    return result as IResultHttp<IConference>;
  }

}
