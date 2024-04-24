import { IConference } from 'src/app/shared/interfaces/IConference';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { IConferenceCards } from '../../shared/interfaces/IConferenceCards';
import { LocalityService } from '../../shared/services/locality.service';
import { ConferenceService } from '../../shared/services/conference.service';
import { Component, OnInit } from '@angular/core';
import { ILocality } from '../../shared/interfaces/ILocality';
import { ParticipationStateService } from '../../shared/services/participation-state.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-conference-map',
  templateUrl: './conference-map.component.html',
  styleUrls: ['./conference-map.component.scss']
})
export class ConferenceMapComponent implements OnInit {

  conferenceInfo: IConference;
  conference: IConferenceCards;
  regionalization: boolean;

  constructor(
    private localitySrv: LocalityService,
    private conferenceSrv: ConferenceService,
    private breadcrumbSrv: BreadcrumbService,
    private router: Router,
    private participationStateSrv: ParticipationStateService
  ) { }

  async ngOnInit() {
    await this.loadConference();
    this.participationStateSrv.clear();
  }

  async loadConference() {
    // If no ConferenceActiveId, something is wrong. Go back to login
    if (!(this.conferenceSrv.ConferenceActiveId) || (this.conferenceSrv.ConferenceActiveId === 0)) {
      await this.router.navigate(['/login']);
    } else { // Having a ConferenceActiveId, go ahead
      // Getting conference data
      const { data } = await this.conferenceSrv.getRegionalization(this.conferenceSrv.ConferenceActiveId);
      this.regionalization = data.regionalization;
      const result = await this.conferenceSrv.GetById(this.conferenceSrv.ConferenceActiveId);
      this.conferenceInfo = result.data;
      // We can only render this page if the conference is currently OPEN
      if (this.conferenceInfo.displayStatusConference === 'OPEN') {
        // If this conference is regionalized, we shall get the localization cards
        if (this.regionalization) {
          const { success, data } = await this.localitySrv.getConferenceCards(this.conferenceSrv.ConferenceActiveId);
          if (success) {
            let localidadesExibicao = ['Central Sul','Caparaó','Nordeste','Rio Doce','Noroeste', 'Centro Oeste', 'Sudoeste Serrana', 'Central Serrana','Metropolitana'];
            data.localities = data.localities.filter(obj => localidadesExibicao.filter(n => n === obj.name).length > 0 );
            this.conference = data;
            this.breadcrumbSrv.add({ title: data.regionalizable});
          }
        } else { // If this conference is not regionalized, we must skip to the steps pages.
          await this.router.navigate(['/conference-steps']);
        }
      } else { // If the conference is not OPEN, no participation page can be rendered. Skip to the Proposals page.
        await this.router.navigate(['/proposals']);
      }
    }
  }

  async selectRegional(item: ILocality) {
    this.breadcrumbSrv.update({
      title: this.conference.regionalizable,
      subTitle: item.name,
      route: ['/conference-map']
    }, 0);
    this.participationStateSrv.setLocality(_.pick(item, ['id', 'name']));
    await this.router.navigate(['/conference-steps']);
  }

  /*
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
        } else {
          if (element.classList.contains('fil1')) {
            element.classList.remove('fil1');
            element.classList.add('fil0');
          }
        }
      });
    }
  }
  */

}
