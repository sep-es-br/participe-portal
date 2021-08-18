import { IHowItWorks } from '../../shared/interfaces/IHowItWorks';
import { Component, OnInit } from '@angular/core';
import { ConferenceService } from 'src/app/shared/services/conference.service';
import { IConference } from 'src/app/shared/interfaces/IConference';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {

  conference: IConference;
  items: IHowItWorks[] = [];

  constructor(
    private conferenceSrv: ConferenceService
  ) { }

  async ngOnInit() {
    await this.loadConference();
  }

  async loadConference() {
    const result = await this.conferenceSrv.GetById(this.conferenceSrv.ConferenceActiveId);
    if (result.success) {
      this.conference = result.data;
      if (this.conference.howItWork && this.conference.howItWork.length > 0) {
        this.items = this.conference.howItWork;
      }
    }
  }

}
