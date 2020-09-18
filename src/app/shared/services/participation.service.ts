import { IItem } from './../interfaces/IItem';

import { IParticipationHeader } from './../interfaces/IParticipationHeader';
import { IResultHttp } from './../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';
import { IParticipationPlanItem } from '../interfaces/IParticipationPlanItem';
import * as qs from 'qs';
import { PrepareHttpQuery } from '../utils/query.utils';
import { IQueryOptions } from '../interfaces/IQueryOptions';
import { IRespParticipation } from '../interfaces/IRespParticipation';

@Injectable({ providedIn: 'root' })
export class ParticipationService extends BaseService<any> {
  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('participation', injector);
  }

  getHeader(conferenceId: number) {
    return this.http.get<IResultHttp<IParticipationHeader>>(
      `${this.urlBase}/portal-header/${conferenceId}`
    ).toPromise();
  }

  getPlanItem(conferenceId: number, localityId: number, planItemId?: number, text?: string) {
    return this.http.get<IResultHttp<IParticipationPlanItem>>(
      `${this.urlBase}/plan-item/${conferenceId}${qs.stringify({
        idLocality: localityId,
        idPlanItem: planItemId,
        text: text
      }, { addQueryPrefix: true })}`
    ).toPromise();
  }

  commentAndHighlights(localityId: number, planItemId: number, conferenceId: number, comment?: string) {
    const sender = {
      planItem: planItemId,
      locality: localityId,
      conference: conferenceId
    };
    if (comment) {
      sender['text'] = comment;
    }
    return this.http.post<IResultHttp<IItem>>(`${this.urlBase}/highlights`, sender).toPromise();
  }

  alternativeProposal(localityId: number, planItemId: number, conferenceId: number, comment: string) {
    return this.http.post<any>(`${this.urlBase}/alternative-proposal`, {
      planItem: planItemId,
      locality: localityId,
      conference: conferenceId,
      text: comment
    }).toPromise();
  }

  getAllByConferenceId(conferenceId: number, queries?: IQueryOptions) {
    return this.http.get<IResultHttp<IRespParticipation>>(`${this.urlBase}/${conferenceId}${PrepareHttpQuery(queries)}`).toPromise();
  }
}
