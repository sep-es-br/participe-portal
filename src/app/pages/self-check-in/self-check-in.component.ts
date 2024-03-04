import { Component, OnInit } from "@angular/core";
import { StoreKeys } from "src/app/shared/commons/contants";
import { AuthService } from "src/app/shared/services/auth.service";
import { MeetingService } from "src/app/shared/services/meeting.service";
import 'moment-timezone';


@Component({
    selector: 'app-self-check-in',
    templateUrl: './self-check-in.component.html',
    styleUrls: ['./self-check-in.component.scss']
})
export class SelfCheckInComponent implements OnInit {


    constructor(
      private authSrv: AuthService,
      protected meetingSrv: MeetingService,
    ){}

    
    async ngOnInit() {
      await this.getPersonAndMeeting(this.authSrv.getUserInfo.id, JSON.parse(sessionStorage.getItem(StoreKeys.CHECK_IN)))
    }

    toCheckin(meeting, personId){
      var now = new Date();
      var timeZone = now.toString().split(' ')[5];
      this.meetingSrv.postCheckIn(meeting, personId, timeZone)
    }

    async getPersonAndMeeting(personId, meeting){
      await this.meetingSrv.findByPersonAndMeeting(personId, meeting).then(
        (res) => {
          const checkInData = Object.entries(res.data)
          if(checkInData.length > 0){
            sessionStorage.removeItem(StoreKeys.CHECK_IN);
            console.log("ja fiz check-in")
          } else {
            this.toCheckin(sessionStorage.getItem(StoreKeys.CHECK_IN), this.authSrv.getUserInfo.id)
            sessionStorage.removeItem(StoreKeys.CHECK_IN);
          }
        }
      )
    }
  }
