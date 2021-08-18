import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConferenceService } from 'src/app/shared/services/conference.service';

@Component({
  selector: 'app-pre-opening',
  templateUrl: './pre-opening.component.html',
  styleUrls: ['./pre-opening.component.scss']
})
export class PreOpeningComponent implements OnInit, OnDestroy {

  conferenceId: number;
  subscription: Subscription;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  preOpeningText: string = '';
  closed: boolean = false;
  meetingDate: number[]; // [yyyy, m-1, d, h, m, s]

  constructor(
    private conferenceSrv: ConferenceService,
    private activeRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.activeRoute.params.subscribe(async ({ conference }) => {
      this.conferenceId = +conference;
      this.dateFormat();
    });
    await this.getTime();
  }

  async getTime() {
    const { success, data } = await this.conferenceSrv.getConferencePreOpeningScreenInfo(this.conferenceId);
    if (success) {
      this.preOpeningText = data.text;
      this.meetingDate = data.date;
      if (this.meetingDate) {
        setInterval(() => {
          this.dateFormat();
        }, 1000);
      }
    }
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
  }

  ddhhmmss(secs) {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const days = Math.floor(hours / 24);
    hours = hours % 24;
    if (days > 0) {
      return { days, hours, minutes, seconds: secs };
    } else if (days < 1 && hours > 0) {
      return { days: 0, hours, minutes, seconds: secs };
    } else if (days < 1 && hours < 1 && minutes > 0) {
      return { days: 0, hours: 0, minutes, seconds: secs };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: secs };
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
