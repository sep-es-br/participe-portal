import {Component, OnInit} from '@angular/core';
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
// import * as moment from 'moment';
// import * as L from 'leaflet';

@Component({
    selector: 'app-pre-registration',
    templateUrl: './pre-registration.component.html',
    styleUrls: ['./pre-registration.component.scss']
  })
  export class PreRegistrationComponent implements OnInit {

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

    startServices(){
        const dados = sessionStorage.getItem(StoreKeys.PRE_REGISTRATION_ACTIVE);
        this.preRegistrationData = JSON.parse(dados);
        if(this.preRegistrationData){
            this.preRegistrationCompleted = true;
        }else{
            this.checkRouteServices();
        }
    }

    checkRouteServices(){//verificar nome da função
        this.meetingId = this.activatedRoute.snapshot.paramMap.get('meeting');
        this.conferenceId = this.activatedRoute.snapshot.paramMap.get('conference');
        if(!sessionStorage.getItem(StoreKeys.PRE_REGISTRATION) && this.meetingId){
            let urlAtual = this.location.path();
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