import { Component, OnInit } from '@angular/core';
import { IConference } from 'src/app/shared/interfaces/IConference';
import { ConferenceService } from 'src/app/shared/services/conference.service';
import { IHowItWorks } from '../../shared/interfaces/IHowItWorks';

@Component({
  selector: 'app-how-it-works-slim',
  templateUrl: './how-it-works-slim.component.html',
  styleUrls: ['./how-it-works-slim.component.scss']
})
export class HowItWorksSlimComponent implements OnInit {

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
