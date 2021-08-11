import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {ConferenceService} from '../../shared/services/conference.service';
import { IConference } from 'src/app/shared/interfaces/IConference';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  conference: IConference;

  constructor(
    private conferenceSrv: ConferenceService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.loadServer();
  }

  async loadServer() {
    const result = await this.conferenceSrv.GetByUrl(document.location.href);
    if (result.success && !(result.data instanceof Array)) {
      this.conference = result.data;
      await this.router.navigate(['/login', this.conference.id]);
    }
  }

}
