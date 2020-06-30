import { ConferenceService } from './../../shared/services/conference.service';
import { IParticipationHeader } from './../../shared/interfaces/IParticipationHeader';
import { ParticipationService } from './../../shared/services/participation.service';
import { Router } from '@angular/router';
import { IPerson } from './../../shared/interfaces/IPerson';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { StoreKeys } from '../../shared/commons/contants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userInfo: IPerson;
  isAuthenticated: boolean;
  header: IParticipationHeader;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private participationSrv: ParticipationService,
    private conferenceSrv: ConferenceService
  ) { }

  async ngOnInit() {
    this.userInfo = this.authSrv.getUserInfo;
    this.isAuthenticated = await this.authSrv.isAuthenticated();
    this.loadParticipationHeader();
  }

  logout() {
    this.authSrv.clearTokens();
    this.router.navigate([`/login/${this.conferenceSrv.ConferenceActiveId}`]);
  }

  async loadParticipationHeader() {
    const { success, data } = await this.participationSrv.getHeader(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.header = data;
    }
  }

}
