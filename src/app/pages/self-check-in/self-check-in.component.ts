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
      // const test = JSON.parse(sessionStorage.getItem(StoreKeys.CHECK_IN))
      // console.log(test)
      // console.log(typeof test)
      await this.getPersonAndMeeting(this.authSrv.getUserInfo.id, JSON.parse(sessionStorage.getItem(StoreKeys.CHECK_IN)))
      //await this.checkin(sessionStorage.getItem(StoreKeys.CHECK_IN), this.authSrv.getUserInfo.id)

      sessionStorage.removeItem(StoreKeys.CHECK_IN);
    }

    checkin(meeting, personId){
      var now = new Date();
      var timeZone = now.toString().split(' ')[5];
      this.meetingSrv.postCheckIn(meeting, personId, timeZone)
    }

    async getPersonAndMeeting(personId, meeting){
      await this.meetingSrv.findByPersonAndMeeting(personId, meeting).then(
        (res) => {console.log(res)}
      )
    }


  }
