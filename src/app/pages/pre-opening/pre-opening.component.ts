import { Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ConferenceService} from 'src/app/shared/services/conference.service';
import { SafeHtml } from '@angular/platform-browser';
import {ButtonModule} from 'primeng/components/button/button';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-pre-opening',
  templateUrl: './pre-opening.component.html',
  styleUrls: ['./pre-opening.component.scss']
})
export class PreOpeningComponent implements OnInit, OnDestroy {

  conferenceId: number;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  preOpeningText: string = '';
  closed: boolean = false;
  meetingDate: number[]; // [yyyy, m-1, d, h, m, s]
  subParams: Subscription;
  interval;
  play = false;

  constructor(
    private conferenceSrv: ConferenceService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.subParams = this.activeRoute.params.subscribe(async ({conference}) => {
      this.conferenceId = +conference;
    });
    await this.getTime();
  }

  async getTime() {
    const {success, data} = await this.conferenceSrv.getConferencePreOpeningScreenInfo(this.conferenceId);
    if (success) {
      this.preOpeningText = data.text;
      const date = data.date && new Date(moment(data.date).toString());
      this.meetingDate = moment(date).toArray();
      if (this.meetingDate) {
        this.startTimer();
      }
    }
  }

  startTimer() {
    this.play = true;
    this.interval = setInterval(() => {
      this.dateFormat();
    });
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.router.navigate([`/login/${this.conferenceId}`], {
      queryParams: {
        isOpen: true
      }
    });
  }

  dateFormat() {
    moment.locale('pt-BR');
    const secs = moment().diff(this.meetingDate, 'seconds');
    let timeLeft: any;
    if (secs < 0) {
      this.closed = true;
      timeLeft = this.ddhhmmss(-secs);
    } else {
      this.closed = false;
      timeLeft = this.ddhhmmss(secs);
    }
    if (timeLeft) {
      this.days = timeLeft.days;
      this.hours = timeLeft.hours;
      this.minutes = timeLeft.minutes;
      this.seconds = timeLeft.seconds;
    }
    if (this.days <= 0 && this.hours <= 0 && this.minutes <= 0 && this.seconds <= 0) {
      this.pauseTimer();
    }
  }

  ddhhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const days = Math.floor(hours / 24);
    hours = hours % 24;
    if (days > 0) {
      return {days, hours, minutes, seconds: secs};
    } else if (days < 1 && hours > 0) {
      return {days: 0, hours, minutes, seconds: secs};
    } else if (days < 1 && hours < 1 && minutes > 0) {
      return {days: 0, hours: 0, minutes, seconds: secs};
    } else {
      return {days: 0, hours: 0, minutes: 0, seconds: secs};
    }
  }

  ngOnDestroy(): void {
    if (this.subParams) {
      this.subParams.unsubscribe();
    }
  }

}
