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
import {take} from "rxjs/internal/operators";
import {PreRegistrationService} from "../../shared/services/pre-registration.service";;

@Component({
  selector: 'app-authority-credential',
  templateUrl: './authority-credential.component.html',
  styleUrl: './authority-credential.component.scss'
})
export class AuthorityCredentialComponent {

  meeting = signal<IMeetingDetail>(undefined);
  user = signal<IPerson>({} as IPerson);
  preRegistration = signal<IPreRegistration>(undefined);
  preRegistrationAuthority = signal<IPreRegistrationAuthority>(undefined);
  step = 1;

  constructor(
    private authSrv: AuthService,
    private meetingService : MeetingService,
    private messageService : MessageService,
    private personService : PersonService,
    private authorityCredential : AuthorityCredentialService,
    private routeSnap : ActivatedRoute,
    private confServ : ConferenceService,
    private preregistrationSrv : PreRegistrationService,
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
      this.routeSnap.queryParams.pipe(take(1)).subscribe(async qparams => {
        let signInDto = qparams['signinDto'];

        if(signInDto) {
          const userInfo = JSON.parse(decodeURIComponent(escape(atob(signInDto)))) as ISocialLoginResult;

          this.authSrv.saveToken(userInfo);
          this.authSrv.saveUserInfo(userInfo.person);
          this.user.set(userInfo.person);
          this.step = 2;
          this.preregistrationSrv.preRegistration(meetingId, userInfo.person.id).then((preRegistration) => {

            this.preRegistration.set(preRegistration.data);
          }).finally(() => {
            this.router.navigate([], {
              queryParams: {
                signinDto: null
              },
              replaceUrl: true
            });
          });

          await  this.router.navigate([], {
            queryParams: {
              signinDto: null
            },
            replaceUrl: true
          });
        }



      });
    });

    effect(async () => {
      if (this.meeting() == null) return;
      if (this.user() == null) return;

      const { success, data } = await this.preregistrationSrv.preRegistrationConfirmed(this.meeting().id, this.user().id);

      if (!success || Array.isArray(data)) return;

      this.preRegistration.set(data);
      this.step = 2;


    });
  }

  updatePreRegistration(sub:string) {

    const personResult = this.personService.findPersonBySub(sub)
      .then(async  (person) => {
        const { success, data } = await this.preregistrationSrv.preRegistrationConfirmed(this.meeting().id, person.data.id);

        if (!success) return;

        this.preRegistration.set(data);
      })
      .catch((reason) => {
      console.error(reason);
    });



  }

  async onRegister([form, undoCredential] : [INewAuthForm, boolean]) {

    let preRegistration;

    if (!undoCredential &&(
      !form.authorityRole ||
      (form.representing == 'other' && (
        !form.authorityCpf ||
        !form.authorityRepresenting
      )) ||
      !form.name ||
      !form.authorityEmail ||
      !form.authorityLocalityId
    )) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulário Imcompleto',
        detail: 'Favor preencher todos os campos',
        life: 15000
      });
      return;
    }

    if (!undoCredential) {
      switch (form.representing) {
        case "himself":
          preRegistration = (await this.authorityCredential.registerAuthority(
            form.id, undefined, form.authorityEmail, form.name, form.authorityLocalityId,
            this.meeting().id, typeof (form.organization) === 'string' ? {name: form.organization} : form.organization,
            form.authorityRole, form.authoritySub, false
          )).data;
          break;
        case "other":
          preRegistration = (await this.authorityCredential.registerAuthority(
            form.id, form.authorityCpf, form.authorityEmail, form.authorityRepresenting, form.authorityLocalityId,
            this.meeting().id, typeof (form.organization) === 'string' ? {name: form.organization} : form.organization,
            form.authorityRole, form.authoritySub, false
          )).data;
          break;
        case "none":
          return;
      }
      this.preRegistrationAuthority.set(preRegistration);
      this.step = 3;
    } else {

      const deleteObj = {
        meetingId: this.meeting().id,
        madeBy: form.id,
        representedByCpf: form.authorityCpf,
        representedBySub: form.authoritySub,
        representedByEmail: form.authorityEmail,
        representedByName: form.representing === "himself" ? form.name : form.authorityRepresenting

      }

      await this.authorityCredential.deleteCredential(deleteObj);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Pré-credenciamento removido com sucesso!',
        life: 3000
      })
      this.step = 1;
    }
  }
}
