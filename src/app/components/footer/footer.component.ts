import { Component, OnInit } from '@angular/core';
import { ConferenceService } from 'src/app/shared/services/conference.service';
import { ParticipationService } from 'src/app/shared/services/participation.service';
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
  image: string;

  constructor(
    private researchSrv: ResearchService,
    private participationSrv: ParticipationService,
    private conferenceSrv: ConferenceService
  ) { }

  async ngOnInit() {
    await this.loadResearchUrl();
    await this.loadFooterImage();
  }

  async loadResearchUrl() {
    const { success, data } = await this.researchSrv.getResearch(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.researchUrl = data.researchLink;
      this.researchStatus = data.researchDisplayStatus;
      this.estimatedTimeResearch = data.estimatedTimeResearch;
    }
  }

  async loadFooterImage(){
    const { success, data } = await this.participationSrv.getFooterImage(this.conferenceSrv.ConferenceActiveId);
    if(success){
        this.image = data['footerImage']
      }
  }

  researchRedirect() {
    window.open(this.researchUrl);
  }
}
