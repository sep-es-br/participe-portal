import { ConferenceService } from '../../shared/services/conference.service';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { IConference } from 'src/app/shared/interfaces/IConference';
import { IPerson } from 'src/app/shared/interfaces/IPerson';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menu: Array<any> = [
    { label: 'Participar', route: '/conference-map', activeWhen: ['conference-map', 'strategic-area'] },
    { label: 'Propostas', route: '/proposals', activeWhen: ['proposals'] },
    { label: 'Minhas Participações', route: '/participations', activeWhen: ['participations'] },
    { label: 'Como Funciona', route: '/how-it-works', activeWhen: ['how-it-works'] },
    { label: 'Estatísticas', route: '/statistics', activeWhen: ['statistics'] },
  ];

  @ViewChild('sidemenu') sidemenu: ElementRef;

  conference: IConference;
  userInfo: IPerson;
  externalLinksMenuItems: MenuItem[];
  displayStatisticsPanel: boolean;
  displayProposalsPanel: boolean;
  menuAberto: boolean = false;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private conferenceSrv: ConferenceService
  ) { }

  async ngOnInit() {
    this.userInfo = this.authSrv.getUserInfo;
    await this.loadConference();
    await this.loadExternalLinksMenuItems();
  }

  isActive(item) {
    const activeWhen = _.get(item, 'activeWhen', []);
    return activeWhen.some(url => location.href.indexOf(url) > -1);
  }


  openSidemenu() {
    this.sidemenu.nativeElement.style.left = '0';
    this.menuAberto = true;
  }

  closeSidemenu() {
    this.sidemenu.nativeElement.style.left = '-95%';
    this.menuAberto = false;
  }

  async logout() {
    this.authSrv.signOut();
  }
  async navigate(url: string) {
    await this.router.navigate([url]);
    this.closeSidemenu();
  }

  async loadConference() {
    const result = await this.conferenceSrv.GetById(this.conferenceSrv.ConferenceActiveId);
    if (result.success) {
      this.displayStatisticsPanel = result.data.showStatisticsPanel;
      if (!this.displayStatisticsPanel){
        this.menu.splice(this.menu.findIndex((item) => item.label == 'Estatísticas'), 1)
        this.router.events.subscribe((event) => {
          if(event instanceof NavigationStart && event.url == "/statistics"){
            this.router.navigate(['/#', '/conference-map'])
          }
        })
      }
      this.displayProposalsPanel = result.data.showProposalsPanel;
      if (!this.displayProposalsPanel){
        this.menu.splice(this.menu.findIndex((item) => item.label == 'Propostas'), 1)
        this.router.events.subscribe((event) => {
          if(event instanceof NavigationStart && event.url == "/proposals"){
            this.router.navigate(['/#', '/conference-map'])
          }
        })
      }
      this.conference = result.data;
      if (this.conference.displayStatusConference !== 'OPEN') {
        this.menu.shift();
        if (this.router.url === '/conference-map') {
          await this.router.navigate(['/proposals']);
        }
      }
    }
  }

  async loadExternalLinksMenuItems() {
    if (this.conference.externalLinks) {
      this.externalLinksMenuItems = this.conference.externalLinks.map(item => ({
        label: item.label, url: item.url, target: '_blank'
      }));
    }
  }

}
