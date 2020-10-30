import { ParticipationStateService } from './../../shared/services/participation-state.service';
import { Router } from '@angular/router';
import { IItem } from './../../shared/interfaces/IItem';
import { ILocality } from './../../shared/interfaces/ILocality';
import { IParticipationPlanItem } from './../../shared/interfaces/IParticipationPlanItem';
import { ConferenceService } from './../../shared/services/conference.service';
import { ParticipationService } from './../../shared/services/participation.service';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import * as _ from 'lodash';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-strategic-area',
  templateUrl: './strategic-area.component.html',
  styleUrls: ['./strategic-area.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('default', style({transform: 'rotateY(90deg)'})),
      state('rotated', style({transform: 'rotateY(0deg)'})),
      transition('rotated => default', animate('500ms ease-out')),
      transition('default => rotated', animate('500ms ease-in'))
    ]),
    trigger('hide',[
      state('default', style({opacity: '0'})),
      state('show', style({opacity: '1'})),
      transition('default => show', animate('500ms ease-in')),
      transition('show => default', animate('500ms ease-out'))
    ]),
    trigger('showMessage', [
      state('default', style({transform: 'translate(450px,0)'})),
      state('show', style({transform: "translate(-450px,0)"})),
      transition('default => show', animate('500ms ease-in')),
      transition('show => default', animate('500ms ease-out'))
    ])
  ]
})
export class StrategicAreaComponent implements OnInit {

  strategicArea: IParticipationPlanItem;
  locality: ILocality;
  indexPage: number = 0;
  totalPages: number = 0;

  hide: string = 'default';
  textSearch: string = '';
  state: string = 'default';
  imageName: string = "search";
  wasFound: boolean = false;
  searchMessage: string;
  disable: boolean = false;
  showMessage: boolean = false;
  classMsg: string;

  constructor(
    private participationSrv: ParticipationService,
    private conferenceSrv: ConferenceService,
    private breadcrumbSrv: BreadcrumbService,
    private participationStateSrv: ParticipationStateService,
    private route: Router
  ) { }

  async ngOnInit() {
    this.participationStateSrv.clearNavigation();
    const participationState = this.participationStateSrv.getSync();
    if (!_.get(participationState, 'locality', '')) {
      this.route.navigate(['/conference-map']);
    } else {
      this.locality = participationState.locality;
      this.loadStrategicArea();
    }
    window.scrollTo(0, 0);
  }

  async loadStrategicArea() {
    const { success, data } = await this.participationSrv.getPlanItem(
      this.conferenceSrv.ConferenceActiveId, this.locality.id as number, null, ''
    );
    if (success) {
      this.strategicArea = data;
      this.breadcrumbSrv.addOrUpdate({
        title: data.structureitem.name
      });
    }
  }

  selectStragicArea(item: IItem) {
    const { name } = this.strategicArea.structureitem;
    this.participationStateSrv.addNavigation({ label: name, nav: item });
    this.breadcrumbSrv.update({ title: name, subTitle: item.name, route: ['/strategic-area'] }, 1);
    this.route.navigate(['/conference-steps', item.id]);
  }

  backNavitation() {
    this.participationStateSrv.clear();
    this.route.navigate(['/conference-map']);
  }

  async showHide() {
    this.textSearch = '';
    this.disable = true;
    await this.delay(10);
    this.hide = (this.hide === 'default' ? 'show' : 'default');
    this.state = (this.state === 'default' ? 'rotated' : 'default');
    if (this.hide === 'default') {
      await this.delay(600);
      this.imageName = "search"
      this.disable = false;
    }
    else {
      this.imageName = "close"
    }

  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  async search() {
    this.indexPage = 0;
    const { success, data } = await this.participationSrv.getPlanItem(this.conferenceSrv.ConferenceActiveId, this.locality.id as number, null, this.textSearch);
    if (success) {
      if (!data.itens || data.itens.length < 1) {
        this.searchMessage = "Hummm... Não estou encontrando esse termo. Que tal tentar um sinônimo ou algo menos específico?"
        this.wasFound = false;
        this.renderList([]);
      }
      else {
        this.searchMessage = "Oba! Encontrei alguma coisa nos itens abaixo!"
        this.wasFound = true;
        this.renderList(data.itens);
      }
      this.showMessage = true;
      this.classMsg = "animate__animated animate__fadeInRightBig"
    }
  }

  renderList(data: IItem[]) {
    this.strategicArea.itens = data;
  }

  async closeMessage() {
    this.classMsg = "animate__animated animate__fadeOutRightBig"
    await this.delay(1000);
    this.showMessage = false;
  }
}
