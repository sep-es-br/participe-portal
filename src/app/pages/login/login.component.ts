import {ActivatedRoute, Router} from '@angular/router';
import {Component, HostListener, OnInit} from '@angular/core';

import {AuthService} from '../../shared/services/auth.service';
import {ConferenceService} from '../../shared/services/conference.service';
import {ILoginScreenInfo} from '../../shared/interfaces/IConferenceActive';
import {IMeetingDetail} from '../../shared/interfaces/IMeetingDetail';
import {ISelectItem} from '../../shared/interfaces/ISelectItem';
import {Meeting} from '../../shared/models/Meeting';
import {MeetingService} from '../../shared/services/meeting.service';
import {MessageService} from 'primeng/api';
import {StoreKeys} from '../../shared/commons/contants';
import {typeMeetingEnum} from 'src/app/shared/enums/TypeMeetingEnum';
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  conferenceData: ILoginScreenInfo;
  statistics: ISelectItem[] = [];
  form: any = {};
  conferenceId: number;
  pagination: any = {
    first: Boolean,
    last: Boolean,
    page: 0,
    size: 5,
    more: Boolean,
    empty: Boolean,
    totalPages: 0
  };
  meetings: Meeting[] = [];
  meetingDetail: IMeetingDetail;
  typeMeeting = typeMeetingEnum;
  modalDetailMeeting: boolean = false;
  responsive: boolean;
  status: string;
  backgroundImageUrl: string = '/assets/images/background.png';

  constructor(
    private authSrv: AuthService,
    private activeRoute: ActivatedRoute,
    private conferenceSrv: ConferenceService,
    private messageSrv: MessageService,
    private meetingSrv: MeetingService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.activeRoute.params.subscribe(async ({conference}) => {
      this.conferenceId = +conference;

      await this.loadConference(this.conferenceId);
      await this.loadMeetingPageNumber(this.conferenceId, `${new Date().toLocaleDateString('pt-BR')} 00:00:00}`);
      await this.loadMeeting(this.conferenceId);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.responsive = event.target.innerWidth <= 800;
  }

  async loadConference(conferenceId: number) {
    localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE, conferenceId.toString());

    const {success, data} = await this.conferenceSrv.getConferenceScreenInfo(conferenceId);

    if (success) {
      this.conferenceData = data;

      this.statistics = [];

      this.statistics.push({value: data.participations, label: 'Participantes'});
      this.statistics.push({value: data.proposal, label: 'Propostas'});
      this.statistics.push({value: data.highlights, label: 'Destaques'});
      this.statistics.push({value: data.numberOfLocalities, label: 'Municípios já participaram'});

      this.backgroundImageUrl = _.get(data, 'backgroundImageUrl.url');

      if (this.conferenceData.status === 'PRE_OPENING') {
        await this.router.navigate([`${this.conferenceId}/pre-opening`]);
      } else if (this.conferenceData.status === 'POST_CLOSURE') {
        await this.router.navigate([`${this.conferenceId}/post-closure`]);
      }

    }
  }

  async loadMeeting(conferenceId: number) {
    const {success, data: {content, totalPages, first, last, empty}} = await this.meetingSrv.getMeetingsByIdConference(
      conferenceId,
      {},
      {
        pageSize: this.pagination.size,
        page: this.pagination.page,
      },
    );

    if (success) {
      this.meetings = content;
      this.pagination.first = first;
      this.pagination.last = last;
      this.pagination.empty = empty;
      this.pagination.totalPages = totalPages;
    }
  }

  showModalDetailMeeting(id: number) {
    const meetingIndex = this.meetings.findIndex(m => m.id === id);
    const meeting: IMeetingDetail = this.meetings[meetingIndex];
    meeting.hasNextMeeting = this.meetings.length - 1 > meetingIndex;
    meeting.hasPreviousMeeting = meetingIndex > 0;
    this.meetingDetail = meeting;
    this.modalDetailMeeting = true;
  }

  labelDescriptionDetailMeeting(meeting: IMeetingDetail): string {
    if (meeting.typeMeetingEnum !== this.typeMeeting.VIRTUAL) {
      return meeting.localityPlace.name;
    } else {
      console.log(meeting);
      return meeting.localityCovers.map(covers => covers.name).join(', ');
    }
  }

  labelDateDetailMetting(dataTime: string) {
    const [date] = dataTime.split(' ');
    const [day, mounth] = date.split('/');
    return `${day}/${mounth}`;
  }

  labelTimeDetailMetting(dataTime: string) {
    const [_, time] = dataTime.split(' ');
    const [hour] = time.split(':');
    return `${hour}h`;
  }

  async meetingNextPage() {
    if (this.pagination.last) {
      this.pagination.page = 0;
    } else {
      this.pagination.page++;
    }

    await this.loadMeeting(this.conferenceId);
  }

  async meetingPreviousPage() {
    if (this.pagination.first) {
      this.pagination.page = this.pagination.totalPages - 1;
    } else {
      this.pagination.page--;
    }
    await this.loadMeeting(this.conferenceId);
  }

  nextMeetingDetail() {
    const indexMeetingCurrent = this.meetings.findIndex(meeting => meeting.id === this.meetingDetail.id);
    if (this.meetingDetail.hasNextMeeting) {
      const indexMeeting = indexMeetingCurrent + 1;
      const meeting: IMeetingDetail = this.meetings[indexMeeting];
      meeting.hasNextMeeting = this.meetings.length - 1 > indexMeeting;
      meeting.hasPreviousMeeting = indexMeeting > 0;
      this.meetingDetail = meeting;
    }
  }

  previousMeetingDetail() {
    const indexMeetingCurrent = this.meetings.findIndex(meeting => meeting.id === this.meetingDetail.id);
    if (this.meetingDetail.hasPreviousMeeting) {
      const indexMeeting = indexMeetingCurrent - 1;
      const meeting: IMeetingDetail = this.meetings[indexMeeting];
      meeting.hasNextMeeting = this.meetings.length - 1 > indexMeeting;
      meeting.hasPreviousMeeting = indexMeeting > 0;
      this.meetingDetail = meeting;
    }
  }

  goToLink(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  signInFacebook() {
    this.authSrv.signInFacebook();
  }

  signInGoogle() {
    this.authSrv.signInGoogle();
  }

  signInAcessoCidadao() {
    this.authSrv.signInAcessoCidadao();
  }

  async signInWithLogin({login, password}) {
    if (!login || !password) {
      return this.messageSrv.add({severity: 'warn', detail: 'Informe o login e senha para efetuar o login', life: 15000});
    }
    const {success, data} = await this.authSrv.signIn(login, password);

    if (success) {
      this.authSrv.saveToken(data);
      this.authSrv.saveUserInfo(data.person);

      if (data.completed) {
        return this.router.navigate(['/conference-map']);
      } else if (!data.completed) {
        return this.router.navigate(['/complete-profile']);
      }
      if (data.temporaryPassword) {
        return this.router.navigate(['/change-password']);
      }
    }
  }

  getDateFromAPIStr(str: string): Date {
    // From dd/mm/yyyy hh:mm:ss to Date
    const [dateStr, timeStr] = str.split(' ');
    const [day, month, year] = dateStr.split('/');
    return new Date(`${month}-${day}-${year} ${timeStr}`);
  }

  private async loadMeetingPageNumber(conferenceId: number, currentDate: string) {
    const {success, data} = await this.meetingSrv.getPageNumberOfMeetingWithCurrentDate(
      conferenceId,
      {currentDate},
      {
        pageSize: this.pagination.size,
        page: 0,
      },
    );

    if (success) {
      this.pagination.page = data.page;
    }
  }
}
