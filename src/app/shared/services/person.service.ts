import { IChangePassword } from './../interfaces/IChangePassword';
import { environment } from './../../../environments/environment';
import { IResultHttp } from './../interfaces/IResultHttp';
import { IPerson } from './../interfaces/IPerson';
import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseService<any> {

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('person', injector);
  }

  complementPerson(data: IPerson) {
    return this.http.post<IResultHttp<any>>(`${this.urlBase}/complement`, data).toPromise();
  }

  updatePassword(form: IChangePassword) {
    return this.http.put<IResultHttp<IPerson>>(`${this.urlBase}`, form).toPromise();
  }

  register(data: IPerson, recaptchaToken: string) {
    return this.http.post<IResultHttp<IPerson>>(`${this.urlBase}?g-recaptcha-response=${recaptchaToken}`, data).toPromise();
  }

  forgotPassword(mail: string, conferenceId: number) {
    return this.http.post<IResultHttp<any>>(`${this.urlBase}/forgot-password`, {
      email: mail,
      conference: conferenceId
    }).toPromise();
  }

}
