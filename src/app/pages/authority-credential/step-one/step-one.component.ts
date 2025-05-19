import {Component, Input, signal, Signal} from '@angular/core';
import {IPerson} from "../../../shared/interfaces/IPerson";
import {IMeetingDetail} from "../../../shared/interfaces/IMeetingDetail";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-authc-step-one',
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent {
  @Input() meeting : IMeetingDetail = {} as IMeetingDetail;

  constructor(
    private authSrv: AuthService
  ) {
  }

  get fullDate() {
    return `${this.meeting.beginDate} - ${this.meeting.endDate?.split(' ')[0].trim() !== this.meeting.beginDate?.split(' ')[0].trim() ? this.meeting.endDate?.split(' ')[0].trim() + ' ' : ''}${this.meeting.endDate?.split(' ')[1]}`;
  }

  signInAcessoCidadao() {
    this.authSrv.signInAcessoCidadao(this.meeting.id);
  }
}
