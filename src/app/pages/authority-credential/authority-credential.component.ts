import { Component } from '@angular/core';
import {TemplateComponent} from "../../components/template/template.component";
import {AppModule} from "../../app.module";
import {MeetingService} from "../../shared/services/meeting.service";
import {ActivatedRouteSnapshot} from "@angular/router";

@Component({
  selector: 'app-authority-credential',
  standalone: true,
  imports: [AppModule],
  templateUrl: './authority-credential.component.html',
  styleUrl: './authority-credential.component.scss'
})
export class AuthorityCredentialComponent {

  meeting;

  constructor(
    private meetingService : MeetingService,
    private routeSnap : ActivatedRouteSnapshot
  ) {
    routeSnap.queryParams.subscribe(params => {
      const meetingId = params['meeting'];
      this.meetingService.getSingleMeeting(meetingId).then(
        meeting => {
          this.meeting = meeting;
        }
      );
    })
  }
}
