import { Router } from '@angular/router';
import { BreadcrumbService } from './../../shared/services/breadcrumb.service';
import { IConferenceCards } from './../../shared/interfaces/IConferenceCards';
import { LocalityService } from './../../shared/services/locality.service';
import { ConferenceService } from './../../shared/services/conference.service';
import { Component, OnInit } from '@angular/core';
import { ILocality } from '../../shared/interfaces/ILocality';
import { ParticipationStateService } from './../../shared/services/participation-state.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-conference-map',
  templateUrl: './conference-map.component.html',
  styleUrls: ['./conference-map.component.scss']
})
export class ConferenceMapComponent implements OnInit {

  conference: IConferenceCards;

  constructor(
    private localitySrv: LocalityService,
    private conferenceSrv: ConferenceService,
    private breadcrumbSrv: BreadcrumbService,
    private router: Router,
    private participationStateSrv: ParticipationStateService
  ) { }

  ngOnInit() {
    this.loadConference();
    this.participationStateSrv.clear();
  }

  async loadConference() {
    const { success, data } = await this.localitySrv.getConferenceCards(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.conference = data;
      this.breadcrumbSrv.update({ title: data.regionalizable, route: ['/conference-map'] }, 0);
    }
  }

  selectRegional(item: ILocality) {
    this.breadcrumbSrv.update({ title: this.conference.regionalizable, subTitle: item.name, route: ['/conference-map'] }, 0);
    this.participationStateSrv.setLocality(_.pick(item, ['id', 'name']));
    this.router.navigate(['/strategic-area']);
  }

  paintMap(item?: ILocality) {
    let map: any = document.querySelector('#map');
    if (map && !map.contentDocument) { return; }
    map = map.contentDocument.querySelector('svg');
    if (map) {
      const paths: any[] = Array.from(map.getElementsByTagName('path'));
      const mapSplitItems = _.get(item, 'mapSplit', []);
      paths.forEach(element => {
        if (mapSplitItems.includes(element.id)) {
          if (element.classList.contains('fil0')) {
            element.classList.remove('fil0');
            element.classList.add('fil1');
          }
          if (element.classList.contains('str0')) {
            element.classList.remove('str0');
            element.classList.add('str1');
          }
        } else {
          if (element.classList.contains('fil1')) {
            element.classList.remove('fil1');
            element.classList.add('fil0');
          }
          if (element.classList.contains('str1')) {
            element.classList.remove('str1');
            element.classList.add('str0');
          }
        }
      });
    }
  }

}
