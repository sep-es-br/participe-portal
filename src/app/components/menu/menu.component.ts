import { ConferenceService } from './../../shared/services/conference.service';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menu: any = [
    { label: 'Participar', route: '/conference-map', activeWhen: ['conference-map', 'strategic-area'] },
    { label: 'Propostas', route: '/proposals', activeWhen: ['proposals'] },
    { label: 'Minhas Participações', route: '/participations', activeWhen: ['participations'] },
    { label: 'Como Funciona', route: '/how-it-works', activeWhen: ['how-it-works'] },
  ];

  @ViewChild('sidemenu') sidemenu: ElementRef;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private conferenceSrv: ConferenceService
  ) { }

  ngOnInit() {
  }

  isActive(item) {
    const activeWhen = _.get(item, 'activeWhen', []);
    return activeWhen.some(url => location.href.indexOf(url) > -1);
  }

  openSidemenu() {
    this.sidemenu.nativeElement.style.left = '0';
  }

  closeSidemenu() {
    this.sidemenu.nativeElement.style.left = '-95%';
  }

  logout() {
    this.authSrv.clearTokens();
    this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
  }
  navigate(url: string) {
    this.router.navigate([url]);
    this.closeSidemenu();
  }

}
