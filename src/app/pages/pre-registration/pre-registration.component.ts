import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { StoreKeys } from "src/app/shared/commons/contants";

@Component({
    selector: 'app-pre-registration',
    templateUrl: './pre-registration.component.html',
    styleUrls: ['./pre-registration.component.scss']
  })
  export class PreRegistrationComponent implements OnInit {

    meetingId:string;
    conferenceId:string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private router: Router
      ) {
      }
    
    ngOnInit() {
        this.checkRouteServices();
    }

    checkRouteServices(){//verificar nome da função
        this.meetingId = this.activatedRoute.snapshot.paramMap.get('meeting');
        this.conferenceId = this.activatedRoute.snapshot.paramMap.get('conference');
        if(!sessionStorage.getItem(StoreKeys.PRE_REGISTRATION) && this.meetingId){
            let urlAtual = this.location.path();
            localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE,this.conferenceId);    
            sessionStorage.setItem(StoreKeys.PRE_REGISTRATION, String(this.meetingId));
            localStorage.setItem(StoreKeys.REDIRECT_URL,urlAtual);
            this.router.navigate(['/login', this.conferenceId]);
        }else if(!this.meetingId){
            this.router.navigate(['/login', this.conferenceId]);
        }
    }


  }