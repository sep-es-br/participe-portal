import {Component, computed, effect, signal} from '@angular/core';
import {TemplateComponent} from "../../components/template/template.component";
import {AppModule} from "../../app.module";
import {MeetingService} from "../../shared/services/meeting.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {IMeetingDetail} from "../../shared/interfaces/IMeetingDetail";
import { ISocialLoginResult } from 'src/app/shared/interfaces/ISocialLoginResult';
import { PersonService } from 'src/app/shared/services/person.service';
import { IPerson } from 'src/app/shared/interfaces/IPerson';
import { INewAuthForm } from './step-two/newAuthForm.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-authority-credential',
  templateUrl: './authority-credential.component.html',
  styleUrl: './authority-credential.component.scss'
})
export class AuthorityCredentialComponent {

  meeting = {} as IMeetingDetail;
  user = signal<IPerson>({} as IPerson)
  step = 1;

  constructor(
    private meetingService : MeetingService,
    private messageService : MessageService,
    private personService : PersonService,
    private routeSnap : ActivatedRoute,
    private router: Router
  ) {
    this.user = this.personService.activePerson;

    this.routeSnap.params.subscribe(params => {

      const meetingId = params['meeting'];
      this.meetingService.getSingleMeeting(meetingId).then(
        meeting => {
          if(Array.isArray(meeting.data)) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Reunião inexistente',
            })
            router.navigateByUrl('/');
            return;
          }
          this.meeting = meeting.data;
        }
      );
    });
    this.routeSnap.queryParams.subscribe(qparams => {
      let signInDto = qparams['signinDto'];

      if(signInDto){
        const userInfo = JSON.parse(decodeURIComponent(escape(atob(signInDto)))) as ISocialLoginResult;
        this.user.set(userInfo.person);
        this.step = 2;
        this.router.navigate([], {
          queryParams: {},
          queryParamsHandling: '',
          replaceUrl: true
        });

      }

    })
  }

  async onRegister(form : INewAuthForm) {

  }

}
