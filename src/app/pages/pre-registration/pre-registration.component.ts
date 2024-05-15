import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { StoreKeys } from "src/app/shared/commons/contants";
import { LoadingService } from 'src/app/shared/services/loading.service';
import { MeetingService } from 'src/app/shared/services/meeting.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { IPerson } from 'src/app/shared/interfaces/IPerson';
import { PreRegistrationService } from 'src/app/shared/services/pre-registration.service';
import { IPreRegistration } from 'src/app/shared/interfaces/IPreRegistration';
import { ColorService } from 'src/app/shared/services/color.service';
import html2canvas  from 'html2canvas';

@Component({
    selector: 'app-pre-registration',
    templateUrl: './pre-registration.component.html',
    styleUrls: ['./pre-registration.component.scss']
  })
  export class PreRegistrationComponent implements OnInit {
    @ViewChild('confirmationCard', { static: false }) content: ElementRef;
    @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

    meetingId:string;
    conferenceId:string;
    loadedServices:boolean = false;
    preRegistrationCompleted:boolean = false;
    preRegistrationData: IPreRegistration;
    meetingData;
    meetingLocationMap;
    userInfo: IPerson;

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private router: Router,
        private loadingService: LoadingService,
        private meetingService: MeetingService,
        private authService: AuthService,
        private preRegistrationService: PreRegistrationService,
        private colorService: ColorService
      ) {
      }
    
    ngOnInit() {
        this.startServices();
    }

    ngAfterViewInit() {
        console.log(this.content.nativeElement); // Verifique se isso retorna o elemento desejado
    }

    startServices(){
        const dados = sessionStorage.getItem(StoreKeys.PRE_REGISTRATION_ACTIVE);
        this.preRegistrationData = JSON.parse(dados);
        if(this.preRegistrationData){
            this.preRegistrationCompleted = true;
            this.userInfo = this.authService.getUserInfo;
        }else{
            this.checkRouteServices();
        }
    }

    checkRouteServices(){//verificar nome da função
        this.meetingId = this.activatedRoute.snapshot.paramMap.get('meeting');
        this.conferenceId = this.activatedRoute.snapshot.paramMap.get('conference');
        if(!sessionStorage.getItem(StoreKeys.PRE_REGISTRATION) && this.meetingId){
            const urlAtual = this.location.path();
            localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE,this.conferenceId);    
            sessionStorage.setItem(StoreKeys.PRE_REGISTRATION, String(this.meetingId));
            localStorage.setItem(StoreKeys.REDIRECT_URL,urlAtual);
            this.colorService.setPrimaryColor(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE))
            this.router.navigate(['/login-pre-registration-self-check-in']);
        }else if(!this.meetingId){
            this.router.navigate(['/login', this.conferenceId]);
        }else{
            
            this.loadDataPreRegistration()
        }
    }

    loadDataPreRegistration(){
        this.meetingService.getSingleMeeting(Number(this.meetingId)).then(
            data => {
                this.meetingData = data.data;
                this.loadedServices = true;
            }
        );
    }

    submitPreRegistration(){
        this.loadingService.loading(true);
        this.userInfo = this.authService.getUserInfo;
        this.preRegistrationService.preRegistration(Number(this.meetingId), this.userInfo.id).then(
            response => {
                sessionStorage.setItem(StoreKeys.PRE_REGISTRATION_ACTIVE, JSON.stringify(response.data));
                this.preRegistrationData = response.data;
                this.preRegistrationCompleted = true;
                this.loadedServices = false;
            }
        ).finally(
            () =>{
                this.loadingService.loading(false);
            }
        );
       
        
    }

    cancel(){
        sessionStorage.removeItem(StoreKeys.PRE_REGISTRATION);
        localStorage.removeItem(StoreKeys.CONFERENCE_ACTIVE);
        this.router.navigate(['/login', this.conferenceId]);
    }

    print(){
        window.print();
    }

    protectExibitionEmail(email?:string){
        if(!email){
            return '*****';
        }
        const emailSplit = email.split('@');
        const emailProtected = emailSplit[0].slice(0,2) + '*****@' + emailSplit[1];
        return emailProtected;
    }

    saveImage() {
        const buttons = this.content.nativeElement.querySelectorAll('.action-buttons');
        buttons.forEach(button => {
          button.classList.add('hide-buttons');
        });
        const width = this.content.nativeElement.offsetWidth;
        const height = this.content.nativeElement.offsetHeight;
        const canvas: HTMLCanvasElement = this.canvas.nativeElement;
        
        if(window.innerWidth < 768 ){
            canvas.width =  850;
            canvas.height = 1780;
        }else{
            canvas.width =  width;
            canvas.height = height;
        }

        html2canvas(this.content.nativeElement,{ canvas }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgData;
          link.download = 'confirmacao_inscricao_'+ this.treatNameExibition(this.preRegistrationData.meeting.name)+ '_' +this.treatNameExibition(this.userInfo.name)+'.png';
          link.click();
          console.log(canvas);
        });

        buttons.forEach(button => {
            button.classList.remove('hide-buttons');
        });
    }

    treatNameExibition(name:string){
        return name.trim().toLowerCase().replace(/ /g, '_'); 
    }

    meetingDate(){
        const beginDate = this.meetingData.beginDate.split(" ");
        const endDate = this.meetingData.endDate.split(" ");
        if(beginDate[0] == endDate[0]){
            return `${this.meetingData.beginDate} - ${endDate[1]}`
        }else{
            return `${this.meetingData.beginDate} - ${this.meetingData.endDate}`
        }
    }


  }