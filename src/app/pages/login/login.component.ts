import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../shared/services/auth.service';
import { ConferenceService } from './../../shared/services/conference.service';
import { ILoginScreenInfo } from './../../shared/interfaces/IConferenceActive';
import { ISelectItem } from './../../shared/interfaces/ISelectItem';
import { Meeting } from './../../shared/models/Meeting';
import { MeetingService } from './../../shared/services/meeting.service';
import { MessageService } from 'primeng/api';
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
  conferenceId: number;
  pagination: any = {
    page: 0,
    size: 5,
    more: Boolean
  };
  meetings: Meeting[] = [];

  constructor(
    private authSrv: AuthService,
    private activeRoute: ActivatedRoute,
    private conferenceSrv: ConferenceService,
    private messageSrv: MessageService,
    private meetingSrv: MeetingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pagination.more = 0
    this.pagination.size = 0
    this.activeRoute.params.subscribe(async ({ conference }) => {
      this.conferenceId = +conference;
      this.loadConference(conference);
      this.loadMeeting(conference);
    });
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

  async loadMeeting(ConferenceId: number) {
    const { success, data: { content, totalPages } } = await this.meetingSrv.getMeetingsByIdConference(
      ConferenceId, { beginDate: `${new Date().toLocaleDateString('pt-BR')} 00:00:00` }, this.pagination.size, this.pagination.page
    );

    if (success) {
      this.meetings = content;
      if(content == null || content.length == 0) {
        this.pagination.more = 0;  
      } else {
        this.pagination.more = content.length > 0 && totalPages > (this.pagination.page + 1);
      }
    }
  }

  meetingNextPage() {
    this.pagination.page++;
    this.loadMeeting(this.conferenceId);
  }
  meetingPreviousPage() {
    this.pagination.page--;
    this.loadMeeting(this.conferenceId);
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
      return this.messageSrv.add({ severity: 'warn', detail: 'Informe o login e senha para efetuar o login', life: 15000 });
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

  getDateFromAPIStr(str: string): Date {
    // From dd/mm/yyyy hh:mm:ss to Date
    const [ dateStr, timeStr ] = str.split(' ');
    const [ day, month, year ] = dateStr.split('/');
    return new Date(`${month}-${day}-${year} ${timeStr}`);
  }
}
