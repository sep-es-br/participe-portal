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
import {IPreRegistration} from "../../shared/interfaces/IPreRegistration";
import {AuthorityCredentialService} from "../../shared/services/authority-credential.service";
import {AuthService} from "../../shared/services/auth.service";
import { IPreRegistrationAuthority } from 'src/app/shared/interfaces/IPreRegistrationAuthority';
import { ConferenceService } from 'src/app/shared/services/conference.service';
import { StoreKeys } from 'src/app/shared/commons/contants';

@Component({
  selector: 'app-authority-credential',
  templateUrl: './authority-credential.component.html',
  styleUrl: './authority-credential.component.scss'
})
export class AuthorityCredentialComponent {

  meeting = signal<IMeetingDetail>(undefined);
  user = signal<IPerson>({} as IPerson);
  preRegistration = signal<IPreRegistrationAuthority>(undefined);
  step = 1;

  constructor(
    private authSrv: AuthService,
    private meetingService : MeetingService,
    private messageService : MessageService,
    private personService : PersonService,
    private authorityCredential : AuthorityCredentialService,
    private routeSnap : ActivatedRoute,
    private confServ : ConferenceService,
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
          this.meeting.set(meeting.data);
          localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE, meeting.data.conference.id);
        }
      );
    });
    this.routeSnap.queryParams.subscribe(qparams => {
      let signInDto = qparams['signinDto'];

      if(signInDto){
        const userInfo = JSON.parse(decodeURIComponent(escape(atob(signInDto)))) as ISocialLoginResult;

        this.authSrv.saveToken(userInfo);
        this.authSrv.saveUserInfo(userInfo.person);
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

    let preRegistration;

    if(
      !form.authorityRole ||
      (form.representing == 'other' && (
        !form.authorityCpf || 
        !form.authorityRepresenting
      )) ||
      !form.name ||
      !form.authorityEmail ||
      !form.authorityLocalityId
    ){
      this.messageService.add({
        severity: 'error',
        summary: 'Formulário Imcompleto',
        detail: 'Favor preencher todos os campos',
        life: 15000
      });
      return;
    }

    switch (form.representing) {
      case "himself":
        preRegistration = (await this.authorityCredential.registerAuthority(
          form.id, undefined, form.authorityEmail, form.name, form.authorityLocalityId,
          this.meeting().id, form.organization, form.authorityRole, form.authoritySub
        )).data;
        break;
      case "other":
        preRegistration = (await this.authorityCredential.registerAuthority(
          form.id, form.authorityCpf, form.authorityEmail, form.authorityRepresenting, form.authorityLocalityId,
          this.meeting().id, form.organization, form.authorityRole, form.authoritySub
        )).data;
        break;
      case "none":
        return;
    }
    this.preRegistration.set(preRegistration);
    this.step = 3;
  }

}
