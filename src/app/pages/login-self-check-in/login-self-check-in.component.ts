import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StoreKeys } from "src/app/shared/commons/contants";
import { IConference } from "src/app/shared/interfaces/IConference";
import { ConferenceService } from "src/app/shared/services/conference.service";


@Component({
    selector: 'app-login-self-check-in',
    templateUrl: './login-self-check-in.component.html',
    styleUrls: ['./login-self-check-in.component.scss']
})
export class LoginSelfCheckInComponent implements OnInit {

    conference: IConference;

    constructor(
      private conferenceSrv: ConferenceService,
        private route: ActivatedRoute,
        private router: Router
    ){}

    
    ngOnInit() {
      sessionStorage.setItem(StoreKeys.CHECK_IN, String(this.route.snapshot.params['meeting']));
      this.login();
    }

    login() {
        this.conferenceSrv.GetByUrl(document.location.href)
          .then((result) => {
            if (result.success && !(result.data instanceof Array)) {
              this.conference = result.data;
              this.router.navigate(['/login', this.conference.id]);
            }
          });
      }

}

