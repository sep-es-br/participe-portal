import { IResultHttp } from '../interfaces/IResultHttp';
import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';
import { IPreRegistration } from '../interfaces/IPreRegistration';

interface IItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class PreRegistrationService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('pre-registration', injector);
  }

  preRegistration(meetingId: number,personId: number){
    const sender = {
      meetingId: meetingId,
      personId: personId
    };
    return this.http.post<IResultHttp<IPreRegistration>>(`${this.urlBase}`,sender).toPromise();
  }
  
  preRegistrationConfirmed(meetingId: number,personId: number){
    console.log(`${this.urlBase}/${meetingId}/${personId}`)
    return this.http.get<IResultHttp<IPreRegistration>>(`${this.urlBase}/${meetingId}/${personId}`).toPromise();
  }


}
