import {IChangePassword} from '../interfaces/IChangePassword';
import {IResultHttp} from '../interfaces/IResultHttp';
import {IPerson} from '../interfaces/IPerson';
import {Inject, Injectable, Injector, signal} from '@angular/core';
import {BaseService} from './base.service';
import {IOptionsContactEmail, IResultPerson} from '../interfaces/IResultPerson';
import { map } from 'rxjs/operators';

type acRoleType = {
  organization: string, 
  role: string, 
  email: string, 
  localityId: number, 
  sub: string
};
type acInfoType = {
  name: string, 
  role: string | undefined, 
  email: string, 
  localityId : number,
  authoritySub : string
};

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseService<any> {


  public readonly activePerson = signal<IPerson>(undefined);

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('person', injector);
  }

  complementPerson(data: IPerson) {
    return this.http.post<IResultHttp<any>>(`${this.urlBase}/complement`, data).toPromise();
  }

  getAcRoleById(idPerson: number, idConference: number) : Promise<IResultHttp<acRoleType>> {
    return this.http.get<IResultHttp<acRoleType>>(`${this.urlBase}/${idPerson}/ACRole/${idConference}`).toPromise();
  }

  findAcInfoByCpf(cpf: string, idConference: number) : Promise<IResultHttp<acInfoType>> {
    return this.http.get<IResultHttp<acInfoType>>(`${this.urlBase}/${cpf}/ACInfoByCpf/${idConference}`).toPromise();
  }

  getPersonById(idPerson: number, idConference: number): Promise<IResultHttp<IResultPerson>> {
    return this.http.get<IResultHttp<IResultPerson>>(`${this.urlBase}/profile/${idPerson}?conferenceId=${idConference}`).toPromise();
  }

  getSubById(idPerson: number): Promise<IResultHttp<{sub}>> {
    return this.http.get<IResultHttp<{sub}>>(`${this.urlBase}/subById/${idPerson}`).toPromise();
  }

  getContactsEmails(idPerson: number): Promise<IResultHttp<IOptionsContactEmail[]>> {
    return this.http.get<IResultHttp<IOptionsContactEmail[]>>(`${this.urlBase}/profile/${idPerson}/emails`).toPromise();
  }

  updatePerson(idPerson: number, person) {
    return this.http.put<IResultHttp<any>>(`${this.urlBase}/profile/${idPerson}`, person).toPromise();
  }

  updatePassword(idPerson: number, form: IChangePassword) {
    return this.http.put<IResultHttp<IPerson>>(`${this.urlBase}/${idPerson}`, form).toPromise();
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

  mergePersonProfile(idPersonToMerge: number) {
    return this.http.put<IResultHttp<any>>(
      `${this.urlBase}/profile/merge/${idPersonToMerge}`,
      null
    ).toPromise();
  }

}
