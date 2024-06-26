import { ConferenceService } from '../../shared/services/conference.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../shared/services/person.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as _ from 'lodash';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  userForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private personSrv: PersonService,
    private conferenceSrv: ConferenceService,
    private router: Router,
    private messageSrv: MessageService,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
    this.setForm({});
  }

  setForm(value) {
    this.userForm = this.formBuilder.group({
      password: [_.get(value, 'password', ''), Validators.required],
      confirmPassword: [_.get(value, 'confirmPassword', ''), Validators.required]
    });
  }

  async save({ password, confirmPassword }) {
    if (password !== confirmPassword) {
      return this.messageSrv.add({ severity: 'warn', detail: 'A senha e a confirmação de senha não são iguais', life: 15000 });
    }
    const { success } = await this.personSrv.updatePassword(this.authSrv.getUserInfo.id, { password, confirmPassword });
    if (success) {
      await this.router.navigate(['/conference-map']);
    }
  }

  async cancel() {
    await this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
  }

}
