import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { StoreKeys } from "src/app/shared/commons/contants";
import { AuthService } from "src/app/shared/services/auth.service";
import { MeetingService } from "src/app/shared/services/meeting.service";



@Component({
    selector: 'app-login-registration',
    templateUrl: './login-registration.component.html',
    styleUrls: ['./login-registration.component.scss']
})
export class LoginRegistrationComponent implements OnInit {

    title: string = '';
    subtitle: string = '';
    meetingName: string = '';
    conferenceName: string = '';
    meetingData;

    constructor(
      private authSrv: AuthService,
      private meetingSrv: MeetingService,
      private messageService: MessageService,
      private route: ActivatedRoute
    ){
      this.loadingStorage();
    }

    async ngOnInit() {
      this.startServices();  
    }

    loadingStorage(){
      const conferenceId = this.route.snapshot.queryParams['conference'];
      const url = this.route.snapshot.queryParams['url'];
      if(url){
        const regex = /\/registration\/(\d+)/;
        const match = url.match(regex);
        if(!localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE)){
          localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE, match[1])
        }
        if(!localStorage.getItem(StoreKeys.REDIRECT_URL)){
          localStorage.setItem(StoreKeys.REDIRECT_URL, url)
        }
      }else if(conferenceId){
        if(!localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE)){
          localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE, conferenceId)
        }
      }
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

        case StoreKeys.PRE_REGISTRATION_MEETING_STARTED:
          await this.meeting(parseInt(sessionStorage.getItem(StoreKeys.PRE_REGISTRATION_MEETING_STARTED)));
          this.title = 'Credenciamento';
          this.subtitle = 'Acesse agora e efetue seu credenciamento para o encontro presencial';
          this.conferenceName = this.meetingData.conference.name;
          this.meetingName = this.meetingData.name;
          break;
      
        case StoreKeys.CHECK_IN_OFF:
          this.title = 'Auto Check-in';
          this.subtitle = 'Encontro presencial encerrado. Acesse abaixo para participar online.';
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
        sessionStorage.removeItem(StoreKeys.PRE_REGISTRATION_MEETING_STARTED);
        sessionStorage.removeItem(StoreKeys.PRE_REGISTRATION);
        sessionStorage.removeItem(StoreKeys.CHECK_IN);
        throw error;
      }
    }
  
  removeSessionStorage(){
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

