import { Component, OnInit } from '@angular/core';
import { ConferenceService } from 'src/app/shared/services/conference.service';
import { ResearchService } from 'src/app/shared/services/research.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  researchUrl: string;
  researchStatus: string;
  estimatedTimeResearch: string;

  constructor(
    private researchSrv: ResearchService,
    private conferenceSrv: ConferenceService
  ) { }

  async ngOnInit() {
    await this.loadResearchUrl();
  }

  async loadResearchUrl() {
    const { success, data } = await this.researchSrv.getResearch(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.researchUrl = data.researchLink;
      this.researchStatus = data.researchDisplayStatus;
      this.estimatedTimeResearch = data.estimatedTimeResearch;
    }
  }

  researchRedirect() {
    window.open(this.researchUrl);
  }
}
