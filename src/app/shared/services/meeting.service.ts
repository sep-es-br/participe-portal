import { IResultHttp } from '../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { MeetingFilterModel } from '../models/MeetingFilterModel';
import {Meeting, MeetingPageNumber} from '../models/Meeting';
import { BaseService } from './base.service';
import { PrepareHttpQuery } from '../utils/query.utils';
import { IResultPaginated } from '../interfaces/IResultPaginated';
import {IQueryOptions} from '../interfaces/IQueryOptions';

@Injectable({ providedIn: 'root' })
export class MeetingService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('meetings', injector);
  }

  getMeetingsByIdConference(conferenceId: number, filter?: MeetingFilterModel, options?: IQueryOptions) {
    return this.http.get<IResultHttp<IResultPaginated<Meeting>>>(`${this.urlBase}/${conferenceId}${PrepareHttpQuery({
      ...options,
      search: filter,
    })}`).toPromise();
  }

  getAllMeetingByConferenceCombo(conferenceId: number) {
    return this.http.get<IResultHttp<IResultPaginated<Meeting>>>(`${this.urlBase}/${conferenceId}`).toPromise();
  }

  getPageNumberOfMeetingWithCurrentDate(conferenceId: number, filter?: MeetingFilterModel, options?: IQueryOptions) {
    return this.http.get<IResultHttp<MeetingPageNumber>>(`${this.urlBase}/${conferenceId}/page-number${PrepareHttpQuery({
      ...options,
      search: filter,
    })}`).toPromise();
  }
}
