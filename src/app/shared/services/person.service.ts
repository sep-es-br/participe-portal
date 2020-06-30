import { environment } from './../../../environments/environment';
import { IResultHttp } from './../interfaces/IResultHttp';
import { IPerson } from './../interfaces/IPerson';
import { Injectable, Inject, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseService<any>{

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super('person', injector);
  }

  complementPerson(data: IPerson) {
    return this.http.post<IResultHttp<any>>(`${environment.apiUrl}/person/complement`, data).toPromise();
  }
}
