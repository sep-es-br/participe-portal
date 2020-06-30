import { ISelectItem } from './../../shared/interfaces/ISelectItem';
import { ILoginScreenInfo } from './../../shared/interfaces/IConferenceActive';
import { ConferenceService } from './../../shared/services/conference.service';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreKeys } from '../../shared/commons/contants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  data: ILoginScreenInfo;
  statistics: ISelectItem[] = [];

  calendar: any = [
    { place: 'Caparaó - Guaçui', date: '13/06' },
    { place: 'Centrol Sul - Cachoeirinha de Itapemirim', date: '13/06' },
    { place: 'Caparaó - Guaçui', date: '13/06' },
    { place: 'Caparaó - Guaçui', date: '13/06' },
    { place: 'Centrol Sul - Cachoeirinha de Itapemirim', date: '13/06' },
  ];

  constructor(
    private authSrv: AuthService,
    private activeRoute: ActivatedRoute,
    private conferenceSrv: ConferenceService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(({ conference }) => this.loadConference(conference));
  }


  async loadConference(conferenceId: number) {
    localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE, conferenceId.toString());
    const { success, data } = await this.conferenceSrv.getConferenceScreenInfo(conferenceId);
    if (success) {
      this.data = data;
      this.statistics.push({ value: data.participations, label: 'Participações' });
      this.statistics.push({ value: data.proposal, label: 'Propostas' });
      this.statistics.push({ value: data.highlights, label: 'Destaques' });
      this.statistics.push({ value: data.numberOfLocalities, label: 'Municípios já participaram' });
    }
  }

  signInFacebook() {
    this.authSrv.signInFacebook();
  }

  signInTwitter() {
    this.authSrv.signInTwitter();
  }

  signInGoogle() {
    this.authSrv.signInGoogle();
  }

  signInAcessoCidadao() {
    this.authSrv.signInAcessoCidadao();
  }

}
