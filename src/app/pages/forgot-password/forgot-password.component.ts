import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../shared/services/person.service';
import { ConferenceService } from '../../shared/services/conference.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as _ from 'lodash';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private personSrv: PersonService,
    private conferenceSrv: ConferenceService,
    private router: Router,
    private messageSrv: MessageService
  ) { }

  ngOnInit() {
    this.setForm({});
  }

  setForm(value) {
    this.userForm = this.formBuilder.group({
      mail: [_.get(value, 'mail', ''), [Validators.required, Validators.email]]
    });
  }

  async save({ mail }) {
    const { success } = await this.personSrv.forgotPassword(mail, this.conferenceSrv.ConferenceActiveId);
    if (success) {
      setTimeout(() => {
        this.messageSrv.add({
          severity: 'success',
          detail: 'Foi enviado para seu e-mail as instruções de como proceder para recuperar a senha'
        });
      }, 1000);
      this.back();
    }
  }

  back() {
    this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
  }

}
