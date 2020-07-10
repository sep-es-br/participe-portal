import { MessageService } from 'primeng/api';
import { ISelectItem } from './../../shared/interfaces/ISelectItem';
import { ILoginScreenInfo } from './../../shared/interfaces/IConferenceActive';
import { ConferenceService } from './../../shared/services/conference.service';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreKeys } from '../../shared/commons/contants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  data: ILoginScreenInfo;
  statistics: ISelectItem[] = [];
  form: any = {};

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
    private conferenceSrv: ConferenceService,
    private messageSrv: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(({ conference }) => this.loadConference(conference));
  }


  async loadConference(conferenceId: number) {
    localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE, conferenceId.toString());
    const { success, data } = await this.conferenceSrv.getConferenceScreenInfo(conferenceId);
    if (success) {
      this.data = data;
      this.statistics.push({ value: data.participations, label: 'Participantes' });
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

  async signInWithLogin({ login, password }) {
    if (!login || !password) {
      return this.messageSrv.add({ severity: 'warn', detail: 'Informe o login e senha para efetuar o login' });
    }
    const { success, data } = await this.authSrv.signIn(login, password);
    if (success) {
      this.authSrv.saveToken(data);
      this.authSrv.saveUserInfo(data.person);
      if (!data.completed) {
        return this.router.navigate(['/complete-profile']);
      }
      if (data.temporaryPassword) {
        return this.router.navigate(['/change-password']);
      }
      this.router.navigate(['/conference-map']);
    }
  }

}
