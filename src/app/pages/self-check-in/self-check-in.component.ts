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

    constructor(
      private formBuilder: FormBuilder,
      private authSrv: AuthService,
      protected meetingSrv: MeetingService,
    ){}

    
    async ngOnInit() {
      await this.getPersonAndMeeting(this.authSrv.getUserInfo.id, JSON.parse(sessionStorage.getItem(StoreKeys.CHECK_IN)))
    }

    isCheckin(meeting, personId){
      var now = new Date();
      var timeZone = now.toString().split(' ')[5];
      this.meetingSrv.postCheckIn(meeting, personId, timeZone)
    }

    async getPersonAndMeeting(personId, meeting){
      await this.meetingSrv.findByPersonAndMeeting(personId, meeting).then(
        (res) => {
          console.log(res.data) //OK
          const checkInData = Object.entries(res.data)
          if(checkInData.length > 0){
            //sessionStorage.removeItem(StoreKeys.CHECK_IN);
            this.setForm(res)
          } else {
            this.isCheckin(sessionStorage.getItem(StoreKeys.CHECK_IN), this.authSrv.getUserInfo.id)
            sessionStorage.removeItem(StoreKeys.CHECK_IN);
          }
          this.loading = false
        }
      )
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
