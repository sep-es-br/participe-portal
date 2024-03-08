import { Component, OnInit } from "@angular/core";
import * as _ from 'lodash';
import { StoreKeys } from "src/app/shared/commons/contants";
import { AuthService } from "src/app/shared/services/auth.service";
import { MeetingService } from "src/app/shared/services/meeting.service";
import 'moment-timezone';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


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

    constructor(
      private formBuilder: FormBuilder,
      private authSrv: AuthService,
      protected meetingSrv: MeetingService,
    ){}

    
    ngOnInit() {
      this.registerAttendance(this.authSrv.getUserInfo.id, JSON.parse(localStorage.getItem(StoreKeys.CHECK_IN)))
    }

    async isCheckin(meeting, personId){
      var now = new Date();
      var timeZone = now.toString().split(' ')[5];
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
      await this.getPersonAndMeeting(personId, meeting)
      if(this.isNotEmptyCheckInObject){
        this.setForm(this.checkInData)
        localStorage.removeItem(StoreKeys.CHECK_IN);
      }else{
        await this.isCheckin(localStorage.getItem(StoreKeys.CHECK_IN), this.authSrv.getUserInfo.id)
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
        localityPlace: [_.get(value.data.meeting.localityPlace, 'name', ''), Validators.required]
      });
    }
  }
