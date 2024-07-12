import {environment} from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
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
    @Inject(Injector) injector: Injector,
    private activatedRoute: ActivatedRoute
  ) {
    super('conferences', injector);
  }

  get ConferenceActiveId(): number {
    try {
      let conferenceActiveId = 0;
      const conferenceId =  this.activatedRoute.snapshot.queryParams['conference'];
      const currentUrl = this.activatedRoute.snapshot.queryParams['url'];
      if(conferenceId != null ){
        conferenceActiveId =  conferenceId;
      }else if(currentUrl != null){
        const regex = /\/registration\/(\d+)/;
        const match = currentUrl.match(regex);
        conferenceActiveId =  match[1];
      }
      if(conferenceActiveId == 0){
        return Number(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE));
      }else{
        return Number(conferenceActiveId);
      }
      // return Number(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE));
    } catch (error) {
      console.log("Erro aqui -->",error)
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
