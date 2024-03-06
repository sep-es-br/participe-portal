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
    teste = [{}]
    verifique = false

    constructor(
      private formBuilder: FormBuilder,
      private authSrv: AuthService,
      protected meetingSrv: MeetingService,
    ){}

    
    async ngOnInit() {
      await this.registerAttendance(this.authSrv.getUserInfo.id, JSON.parse(sessionStorage.getItem(StoreKeys.CHECK_IN)))
    }

    async isCheckin(meeting, personId){
      var now = new Date();
      var timeZone = now.toString().split(' ')[5];
     await this.meetingSrv.postCheckIn(meeting, personId, timeZone)
    }

    async getPersonAndMeeting(personId, meeting){
      await this.meetingSrv.findByPersonAndMeeting(personId, meeting).then(
        (res) => {
          this.teste = res
          const checkInData = Object.entries(res.data)
          if(checkInData.length > 0){
            this.verifique = true;
          } else {
            this.verifique = false;
          }
        }
      )
    }

    async registerAttendance(personId, meeting){
      await this.getPersonAndMeeting(personId, meeting)
      if(this.verifique == true){
        this.setForm(this.teste)
      }else{
        await this.isCheckin(sessionStorage.getItem(StoreKeys.CHECK_IN), this.authSrv.getUserInfo.id)
        await this.getPersonAndMeeting(personId, meeting)
        this.setForm(this.teste)
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
