import {ConferenceService} from '../../shared/services/conference.service';
import {IParticipationHeader} from '../../shared/interfaces/IParticipationHeader';
import {ParticipationService} from '../../shared/services/participation.service';
import {Router} from '@angular/router';
import {IPerson} from '../../shared/interfaces/IPerson';
import {AuthService} from '../../shared/services/auth.service';
import {Component, OnInit} from '@angular/core';
import {StoreKeys} from '../../shared/commons/contants';
import {IConference} from 'src/app/shared/interfaces/IConference';
import {MenuItem} from 'primeng/api';
import {ResearchService} from "../../shared/services/research.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userInfo: IPerson;
  isAuthenticated: boolean;
  header: IParticipationHeader;
  display: boolean = false;
  isAnswered: boolean = false;
  conference: IConference;
  externalLinksMenuItems: MenuItem[];
  researchUrl: string;
  estimatedTimeResearch: string;
  displayExternalLinks: boolean;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private participationSrv: ParticipationService,
    private conferenceSrv: ConferenceService,
    private researchSrv: ResearchService
  ) {
  }

  async ngOnInit() {
    this.userInfo = this.authSrv.getUserInfo;
    this.isAuthenticated = await this.authSrv.isAuthenticated();
    if (this.isAuthenticated) {
      await this.loadParticipationHeader();
      await this.loadConferenceExternalLinks();
    }
  }

  async showDialog() {
    const key = localStorage.getItem(StoreKeys.IS_PROFILE_INCOMPLETED);

    if (key && JSON.parse(key)) {
      localStorage.removeItem(StoreKeys.IS_PROFILE_INCOMPLETED);
      await this.logout();
      return;
    }

    const { success, data } = await this.researchSrv.getResearch(this.conferenceSrv.ConferenceActiveId);

    if (!this.isAnswered && success && data.researchDisplayStatus === 'ACTIVE') {
      this.display = true;
    } else {
      await this.logout();
    }
  }

  async logout() {
    this.authSrv.signOut();
  }

  async researchRedirect() {
    window.open(this.researchUrl);
    await this.wannaAnswerLater({answer: false});
  }

  async wannaAnswerLater({answer}) {
    this.isAnswered = !answer;
    const {success} = await this.participationSrv.setSurvey(this.conferenceSrv.ConferenceActiveId, this.isAnswered);
    if (success) {
      await this.logout();
    }
  }

  async navigate(url: string) {
    await this.router.navigate([url]);
  }

  async loadParticipationHeader() {
    const {success, data} = await this.participationSrv.getHeader(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.header = data;
      this.isAnswered = data.answerSurvey;
      this.researchUrl = data.research.researchLink;
      this.estimatedTimeResearch = data.research.estimatedTimeResearch;
    }
  }

  async loadConferenceExternalLinks() {
    const result = await this.conferenceSrv.GetById(this.conferenceSrv.ConferenceActiveId);
    if (result.success) {
      this.displayExternalLinks = result.data.showExternalLinks;
      this.conference = result.data;
      this.loadExternalLinksMenuItems();
    }
  }

  loadExternalLinksMenuItems() {
    if (this.conference.externalLinks) {
      this.externalLinksMenuItems = this.conference.externalLinks.map(item => ({
        label: item.label, url: item.url, target: '_blank'
      }));
    }
  }

}
