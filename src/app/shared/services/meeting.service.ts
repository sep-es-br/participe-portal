import { IResultHttp } from './../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { MeetingFilterModel } from './../models/MeetingFilterModel';
import { Meeting } from './../models/Meeting';
import { BaseService } from './base.service';
import { PrepareHttpQuery } from '../utils/query.utils';
import { IResultPaginated } from '../interfaces/IResultPaginated';

@Injectable({ providedIn: 'root' })
export class MeetingService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('meetings', injector);
  }

  getMeetingsByIdConference(conferenceId: number, filter?: MeetingFilterModel, pageSize?: number, page?: number) {
    return this.http.get<IResultHttp<IResultPaginated<Meeting>>>(`${this.urlBase}/${conferenceId}${PrepareHttpQuery({
      search: filter,
      page,
      pageSize
    })}`).toPromise();
  }


}
