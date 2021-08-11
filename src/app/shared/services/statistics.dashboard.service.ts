import { Injectable, Injector, Inject } from '@angular/core';
import { BaseService } from './base.service';
import { IResultHttp } from '../interfaces/IResultHttp';
import { HttpParams } from '@angular/common/http';
import { IStatisticsDashboardData } from '../interfaces/IStatisticsDashboardData';

@Injectable({
  providedIn: 'root'
})
export class StatisticsDashboardService extends BaseService<any> {

  constructor(@Inject(Injector) injector: Injector) {
    super('control-panel-dashboard', injector);
  }

  getDashboardData(idConference: number,
                   result?: string,
                   origin?: string,
                   meetings?: number[],
                   microregionChartAgroup?: number,
                   microregionLocalitySelected?: number,
                   stLastLevelLocality?: boolean,
                   structureItemSelected?: number,
                   structureItemPlanSelected?: number,
                   stLastLevelPlanItem?: boolean,
  ) {
    let params = new HttpParams();
    params = idConference ? params.append('idConference', idConference.toString()) : params;
    params = result.length > 0 ? params.append('result', result) : params;
    params = origin && origin.length > 0 ? params.append('origin', origin) : params;
    params = meetings && meetings.length > 0 ? params.append('meetings', meetings.join(',')) : params;
    params = microregionChartAgroup ? params.append('microregionChartAgroup', microregionChartAgroup.toString()) : params;
    params = microregionLocalitySelected ? params.append('microregionLocalitySelected', microregionLocalitySelected.toString()) : params;
    params = stLastLevelLocality ? params.append('stLastLevelLocality', stLastLevelLocality.toString()) : params;
    params = structureItemSelected ? params.append('structureItemSelected', structureItemSelected.toString()) : params;
    params = structureItemPlanSelected ? params.append('structureItemPlanSelected', structureItemPlanSelected.toString()) : params;
    params = stLastLevelPlanItem ? params.append('stLastLevelPlanItem', stLastLevelPlanItem.toString()) : params;
    const url = `${this.urlBase}`;
    return this.http.get<IResultHttp<IStatisticsDashboardData>>(url, { params }).toPromise();
  }

  getAllTypeLocalityFromParents(idDomain: number, idTypeLocality: number) {
    return this.http.get<IResultHttp<{id: number; name: string}[]>>(
      `${this.urlBase}/locality-parents`.concat(`?idDomain=${idDomain}`)
      .concat(`&idTypeLocality=${idTypeLocality}`)
    ).toPromise();
  }

}
