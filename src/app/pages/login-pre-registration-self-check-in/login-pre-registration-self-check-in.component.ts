import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { StoreKeys } from "src/app/shared/commons/contants";
import { AuthService } from "src/app/shared/services/auth.service";
import { MeetingService } from "src/app/shared/services/meeting.service";



@Component({
    selector: 'app-login-pre-registration-self-check-in',
    templateUrl: './login-pre-registration-self-check-in.component.html',
    styleUrls: ['./login-pre-registration-self-check-in.component.scss']
})
export class LoginPreRegistrationSelfCheckInComponent implements OnInit {

    title: string = '';
    subtitle: string = '';
    meetingName: string = '';
    meetingData;

    constructor(
      private authSrv: AuthService,
      private meetingSrv: MeetingService
    ){}

    async ngOnInit() {
      if(sessionStorage.getItem(StoreKeys.PRE_REGISTRATION)){
        await this.meeting(parseInt(sessionStorage.getItem(StoreKeys.PRE_REGISTRATION)));
        this.title = 'Pré-credenciamento'
        this.subtitle = 'Acesse agora para realizar o pré-credenciamento'
        this.meetingName =`do encontro ${this.meetingData.name}`
        console.log(this.meetingData.name)
      }else if(sessionStorage.getItem(StoreKeys.CHECK_IN)){
        await this.meeting(parseInt(sessionStorage.getItem(StoreKeys.CHECK_IN)));
        this.title = 'Auto Check-in'
        this.subtitle = 'Acesse agora para confirmar sua presença'
        this.meetingName =`no encontro ${this.meetingData.name}`
        console.log(this.meetingData.name)
      }
    }

    async meeting(meeting: number){
      await this.meetingSrv.getSingleMeeting(meeting).then(
        meeting => {
          this.meetingData = meeting.data
      }
      )
    }

      

      signInGoogle() {
        this.authSrv.signInGoogle();
      }
    
      signInAcessoCidadao() {
        this.authSrv.signInAcessoCidadao();
      }
}

