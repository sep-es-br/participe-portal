import {Router} from '@angular/router';
import {Component, Inject, OnInit} from '@angular/core';
import {ConferenceService} from '../../shared/services/conference.service';
import { IConference } from 'src/app/shared/interfaces/IConference';
import { DOCUMENT } from '@angular/common';


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

  ngOnInit() {
    this.loadServer();
  }

  loadServer() {
    if(window.location.pathname.startsWith("/authority-credential"))
      return

    this.conferenceSrv.GetByUrl(document.location.href)
      .then((result) => {
        if (result.success && !(result.data instanceof Array)) {
          this.conference = result.data;
          this.router.navigate(['/login', this.conference.id]);
        }
      });
  }
}
