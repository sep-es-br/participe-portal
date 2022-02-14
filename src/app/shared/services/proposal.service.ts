import { Injectable, Injector, Inject } from '@angular/core';
import { BaseService } from './base.service';
import { IResultHttp } from '../interfaces/IResultHttp';
import { IProposalFilters } from '../interfaces/IProposalFilters';
import * as qs from 'qs';
import { IProposals } from '../interfaces/IProposals';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProposalService extends BaseService<any> {

  constructor( @Inject(Injector) injector: Injector) {
    super('proposals', injector);
  }

  getFilters(conferenceId: number) {
    return this.http.get<IResultHttp<IProposalFilters>>(`${this.urlBase}/filters/${conferenceId}`).toPromise();
  }

  async getPoposals(conferenceId: number, indexPage: number, text: string, localityIds: number[], planItemIds: number[]) {
    let params = new HttpParams();
    params = localityIds.length > 0 ? params.append('localityIds', localityIds.join(',')) : params;
    params = planItemIds.length > 0 ? params.append('planItemIds', planItemIds.join(',')) : params;
    params = text ? params.append('text', text) : params;

    const url = `${this.urlBase}/${conferenceId}${qs.stringify({pageNumber:indexPage}, { addQueryPrefix: true })}`;
    return await this.http.get<IResultHttp<IProposals>>(url, {params: params}).toPromise();
  }

  makeLike(idComment: number) {
    const url = `${this.urlBase}/likes/${idComment}`;
    return this.http.get<IResultHttp<number>>(url).toPromise();
  }
}
