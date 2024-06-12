import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { MessageService } from "primeng/api";
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
    conferenceName: string = '';
    meetingData;

    constructor(
      private authSrv: AuthService,
      private meetingSrv: MeetingService,
      private messageService: MessageService
    ){}

    async ngOnInit() {
      this.startServices();  
    }

    async startServices(){
      const getKeyFromSessionStorage = () => {
        const keys = [
          StoreKeys.PRE_REGISTRATION,
          StoreKeys.CHECK_IN,
          StoreKeys.CHECK_IN_OFF,
          StoreKeys.PRE_REGISTRATION_MEETING_STARTED,
          StoreKeys.PRE_REGISTRATION_MEETING_CLOSED
        ];
      
        return keys.find(key => sessionStorage.getItem(key)) || null;
      };
      
      const key = getKeyFromSessionStorage();
      
      switch (key) {
        case StoreKeys.PRE_REGISTRATION:
          await this.meeting(parseInt(sessionStorage.getItem(StoreKeys.PRE_REGISTRATION)));
          this.title = 'Pré-credenciamento';
          this.subtitle = 'Acesse agora e efetue seu pré-credenciamento para o encontro presencial';
          this.conferenceName = this.meetingData.conference.name;
          this.meetingName = this.meetingData.name;
          break;
      
        case StoreKeys.CHECK_IN:
          await this.meeting(parseInt(sessionStorage.getItem(StoreKeys.CHECK_IN)));
          this.title = 'Auto Check-in';
          this.subtitle = 'Acesse agora para registrar sua presença no encontro';
          this.conferenceName = this.meetingData.conference.name;
          this.meetingName = this.meetingData.name;
          break;
      
        case StoreKeys.CHECK_IN_OFF:
          this.title = 'Auto Check-in';
          this.subtitle = 'Encontro presencial encerrado. Acesse abaixo para participar online.';
          break;
      
        case StoreKeys.PRE_REGISTRATION_MEETING_STARTED:
          this.title = 'Pré-credenciamento';
          this.subtitle = 'O período de pré-credenciamento já está encerrado, pois este encontro já começou. Procure a recepção para se credenciar e registrar a sua presença. Acesse abaixo para participar online.';
          break;
      
        case StoreKeys.PRE_REGISTRATION_MEETING_CLOSED:
          this.title = 'Pré-credenciamento';
          this.subtitle = 'Este encontro já terminou. Acesse abaixo para participar online.';
          break;
      
        default:
          this.title = 'Ocorreu um erro';
          this.subtitle = 'Por favor, verifique o link e tente novamente.';
          let element = document.querySelector('.social-login') as HTMLLIElement
          element.style.display = 'none'
          break;
      }
    }



    async meeting(meetingId: number) {
      try {
        const response = await this.meetingSrv.getSingleMeeting(meetingId);
        this.meetingData = response.data;
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível encontrar a reunião'
        });
        this.title = 'Ocorreu um erro';
        this.subtitle = 'favor verificar o link e tentar novamente.';
        let element = document.querySelector('.social-login') as HTMLLIElement
        element.style.display = 'none'
        sessionStorage.removeItem(StoreKeys.PRE_REGISTRATION);
        sessionStorage.removeItem(StoreKeys.CHECK_IN);
        throw error;
      }
    }
  
  removeSessionStorage(){
    sessionStorage.removeItem(StoreKeys.PRE_REGISTRATION_MEETING_STARTED);
    sessionStorage.removeItem(StoreKeys.PRE_REGISTRATION_MEETING_CLOSED);
    sessionStorage.removeItem(StoreKeys.CHECK_IN_OFF);
  }

  signInGoogle() {
    this.removeSessionStorage()
    this.authSrv.signInGoogle();
  }

  signInAcessoCidadao() {
    this.removeSessionStorage()
    this.authSrv.signInAcessoCidadao();
  }
}

