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
import { IPerson } from "src/app/shared/interfaces/IPerson";


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
    userInfo: IPerson;
    tokenAccess: string;

    constructor(
      private conferenceSrv: ConferenceService,
      private formBuilder: FormBuilder,
      private authSrv: AuthService,
      private meetingSrv: MeetingService,
      private router: Router,
      private route: ActivatedRoute,
      private colorService: ColorService
    ){
      
    }

    
    async ngOnInit() {
      this.verifyCheckIn().then(()=>{
        if(this.isNotEmptyCheckInObject){
          sessionStorage.removeItem(StoreKeys.LOGIN_CHECK_IN)
          sessionStorage.removeItem(StoreKeys.CHECK_IN)
          this.router.navigate(['/']);
        }
      });
      const selfcheckInIsOpen = await this.meetingSrv.getSelfCheckInOrPreRegistrationOpen(this.route.snapshot.params['meeting'],"self-check-in")
      if(selfcheckInIsOpen.data.length == 0){
        await sessionStorage.setItem(StoreKeys.CHECK_IN_OFF, this.route.snapshot.params['meeting']);
        await localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE,this.route.snapshot.params['conference']);
        await this.colorService.setPrimaryColor(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE))
        this.router.navigate(['/login-pre-registration-self-check-in']);
      }else if(!sessionStorage.getItem(StoreKeys.LOGIN_CHECK_IN)){
        await this.loadingVariable()
        await this.colorService.setPrimaryColor(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE))
        this.router.navigate(['/login-pre-registration-self-check-in']);
      }else{
        sessionStorage.removeItem(StoreKeys.CHECK_IN)
        sessionStorage.removeItem(StoreKeys.LOGIN_CHECK_IN)
        await this.registerAttendance(this.authSrv.getUserInfo.id, JSON.parse(this.route.snapshot.params['meeting']))
      }
    }

    async loadingVariable(){
      await sessionStorage.setItem(StoreKeys.CHECK_IN, this.route.snapshot.params['meeting']);
      await sessionStorage.setItem(StoreKeys.LOGIN_CHECK_IN, 'true');
      await localStorage.setItem(StoreKeys.CONFERENCE_ACTIVE,this.route.snapshot.params['conference']);
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

    async verifyCheckIn(){
      const userAutenticated = await this.authSrv.isAuthenticated();
      if(userAutenticated !== false){
        this.userInfo = this.authSrv.getUserInfo;
      }
      if(this.userInfo){
      await this.getPersonAndMeeting(this.userInfo.id, JSON.parse(this.route.snapshot.params['meeting']))
    }
  }

    async registerAttendance(personId, meeting){
      await this.conferenceSrv.GetById(parseInt(this.route.snapshot.params['conference'])).then(
        (res) => {
          this.conference = res.data
      })
      await this.getPersonAndMeeting(personId, meeting)
      if(this.isNotEmptyCheckInObject){
        this.router.navigate(['/']);
      }else{
        await this.isCheckin(meeting, this.authSrv.getUserInfo.id)
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
      sessionStorage.removeItem(StoreKeys.LOGIN_CHECK_IN)
      this.router.navigate(['/conference-map']);
  }
  }
