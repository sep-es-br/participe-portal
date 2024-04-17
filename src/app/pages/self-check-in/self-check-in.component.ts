import { Component, OnInit } from "@angular/core";
import * as _ from 'lodash';
import { StoreKeys } from "src/app/shared/commons/contants";
import { AuthService } from "src/app/shared/services/auth.service";
import { MeetingService } from "src/app/shared/services/meeting.service";
import 'moment-timezone';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConferenceService } from "src/app/shared/services/conference.service";
import { IConference } from "src/app/shared/interfaces/IConference";
import { ColorService } from "src/app/shared/services/color.service";


@Component({
    selector: 'app-self-check-in',
    templateUrl: './self-check-in.component.html',
    styleUrls: ['./self-check-in.component.scss']
})
export class SelfCheckInComponent implements OnInit {

    userForm: FormGroup;
    loading = true;
    checkInData = [{}]
    isNotEmptyCheckInObject = false
    conference: IConference

    constructor(
      private conferenceSrv: ConferenceService,
      private formBuilder: FormBuilder,
      private authSrv: AuthService,
      protected meetingSrv: MeetingService,
      private router: Router,
      private route: ActivatedRoute,
      private colorService: ColorService
    ){}

    
    ngOnInit() {
      if(!localStorage.getItem(StoreKeys.LOGIN_CHECK_IN)){
        sessionStorage.setItem(StoreKeys.CHECK_IN, this.route.snapshot.params['meeting'])
        localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE,this.route.snapshot.params['conference']);
        localStorage.setItem(StoreKeys.LOGIN_CHECK_IN, 'true');
        this.colorService.setPrimaryColor(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE))
        this.router.navigate(['/login-pre-registration-self-check-in']);
      }else{
        localStorage.removeItem(StoreKeys.LOGIN_CHECK_IN)
        this.registerAttendance(this.authSrv.getUserInfo.id, JSON.parse(sessionStorage.getItem(StoreKeys.CHECK_IN)))
      }
    }

    async isCheckin(meeting, personId){
      const now = new Date();
      const timeZone = now.toString().split(' ')[5];
     await this.meetingSrv.postCheckIn(meeting, personId, timeZone)
    }

    async getPersonAndMeeting(personId, meeting){
      await this.meetingSrv.findByPersonAndMeeting(personId, meeting).then(
        (res) => {
          this.checkInData = res
          this.isNotEmptyCheckInObject = Object.entries(res.data).length > 0
        }
      )
    }

    async registerAttendance(personId, meeting){
      await this.conferenceSrv.GetById(parseInt(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE))).then(
        (res) => {
          this.conference = res.data
      })
      await this.getPersonAndMeeting(personId, meeting)
      if(this.isNotEmptyCheckInObject){
        this.setForm(this.checkInData)
      }else{
        await this.isCheckin(sessionStorage.getItem(StoreKeys.CHECK_IN), this.authSrv.getUserInfo.id)
        await this.getPersonAndMeeting(personId, meeting)
        this.setForm(this.checkInData)
      }
      this.loading = false;
    }

    async setForm(value) {
      this.userForm = this.formBuilder.group({
        personName: [_.get(value.data.person, 'name', ''), Validators.required],
        date: [_.get(value.data, 'time', ''), Validators.required],
        meetingName: [_.get(value.data.meeting, 'name', ''), Validators.required],
        localityPlace: [_.get(value.data.meeting.localityPlace, 'name', ''), Validators.required],
        conferenceName:[_.get(this.conference, 'name', ''), Validators.required]
      });
    }

    cancel(){
      sessionStorage.removeItem(StoreKeys.CHECK_IN);
      this.router.navigate(['/conference-map']);
  }
  }
