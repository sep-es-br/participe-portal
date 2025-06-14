import { IResultHttp } from '../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { MeetingFilterModel } from '../models/MeetingFilterModel';
import {Meeting, MeetingPageNumber} from '../models/Meeting';
import { BaseService } from './base.service';
import { PrepareHttpQuery } from '../utils/query.utils';
import { IResultPaginated } from '../interfaces/IResultPaginated';
import {IQueryOptions} from '../interfaces/IQueryOptions';
import * as qs from 'qs';
import { IMeetingDetail } from '../interfaces/IMeetingDetail';


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

  getSingleMeeting(meetingId: number): Promise<any>{
    return  this.http.get<any>(
      `${this.urlBase}${qs.stringify({
        meetingId: meetingId
      }, { addQueryPrefix: true })}`
    ).toPromise();
  }

  preRegistration(meetingId: number,personId: number){
    const sender = {
      meetingId: meetingId,
      personId: personId
    };
    return this.http.post<IResultHttp<any>>(`${this.urlBase}/pre-registration`,sender).toPromise();
  }
  postCheckIn(meetingId: number, personId: number, timeZone: string): Promise<any> {
    return this.http.post(
      `${this.urlBase}/selfcheckIn`,
      {
        meetingId,
        personId,
        timeZone
      },
    ).toPromise();
  }


  findByPersonAndMeeting(personId: number, meetingId: number): Promise<any>{
    return this.http.get<IResultHttp<any>>(`${this.urlBase}/checkIn/${meetingId}`, {
      params: { personId: personId.toString() }
    }).toPromise();
  }

  getSelfCheckInOrPreRegistrationOpen(meetingId: number, participationType: string): Promise<any>{
    return this.http.get<IResultHttp<any>>(`${this.urlBase}/${meetingId}/${participationType}`).toPromise();
  }

}
