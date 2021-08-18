import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MessageService, SelectItem} from 'primeng/api';
import {AuthenticationTypeEnum, LoginNameEnum} from 'src/app/shared/enums/LoginNameEnum';
import {IAutentication, IResultPerson} from 'src/app/shared/interfaces/IResultPerson';
import {ILoginProfileResult} from 'src/app/shared/interfaces/ISocialLoginResult';
import {AuthService} from 'src/app/shared/services/auth.service';
import {ConferenceService} from 'src/app/shared/services/conference.service';
import {LocalityService} from 'src/app/shared/services/locality.service';
import {PersonService} from 'src/app/shared/services/person.service';
import formatCPF from 'src/app/shared/utils/formatCPF';
import * as _ from 'lodash';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  person: IResultPerson;
  userForm: FormGroup;
  regionName: string;
  optionsLocality: SelectItem[] = [];
  optionsContactEmail: SelectItem[] = [];
  optionsLogin: SelectItem[] = [];
  localityType: string;
  statusLogin: string = 'DESATIVADO';

  mergeEventData: any = {
    email: String,
    personId: Number,
    displayMergeProfileDialog: Boolean(false),
  };

  passwordValidator = (control: AbstractControl): ValidationErrors => {
    if (control.value && control.value.length < 6) {
      return {custom: {invalid: true, message: 'Senha deve conter 6 dígitos'}};
    }
    return null;
  };

  constructor(
    private personSvr: PersonService,
    private localitySrv: LocalityService,
    private conferenceSrv: ConferenceService,
    private authSrv: AuthService,
    private messageSrv: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    await this.loadScreen();
  }

  async loadScreen() {
    await this.loadPerson();
    this.getBackupData();
    await this.loadContactEmails();
    this.processSocialLoginProfile();
    this.loadOptionsLogin();
    await this.loadLocalities();
    this.setForm(this.person);
  }

  async loadPerson() {
    const {data, success} = await this.personSvr.getPersonById(this.authSrv.getUserInfo.id, this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.person = data;
      this.statusLogin = this.findAuthentication(LoginNameEnum.PARTICIPE) ? 'ATIVO' : 'DESATIVADO';
    }
  }

  async loadContactEmails() {
    const {data, success} = await this.personSvr.getContactsEmails(this.authSrv.getUserInfo.id);
    if (success) {
      this.optionsContactEmail = data.map(email => {
        return {label: email.email, value: email.email};
      });

    }
  }

  loadOptionsLogin() {
    if (this.optionsContactEmail) {
      this.optionsLogin = this.optionsContactEmail;
      const autenticationCpf = this.findAuthentication(AuthenticationTypeEnum.CPF, 'authenticationType');
      if (autenticationCpf) {
        this.optionsLogin.push({label: this.formatCpfFromApi(autenticationCpf.loginEmail), value: autenticationCpf.loginEmail});
      }
    }
  }

  formatCpfFromApi(cpf: string) {
    return formatCPF(cpf.split('@')[0]);
  }

  async loadLocalities() {
    const {success, data} = await this.localitySrv.getAllForConference(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.localityType = data.nameType;
      this.optionsLocality = data.localities.map(locality => {
        return {label: locality.name, value: locality.id};
      });
    }
  }

  setForm(value) {
    this.userForm = this.formBuilder.group({
      name: [_.get(value, 'name', ''), Validators.required],
      contactEmail: [_.get(value, 'contactEmail', ''), Validators.required],
      telephone: [_.get(value, 'telephone', '')],
      localityId: [_.get(value, 'localityId', null)],
      newPassword: [_.get(value, 'newPassword', null), this.passwordValidator],
      confirmNewPassword: [_.get(value, 'confirmNewPassword', null), this.passwordValidator],
      receiveInformational: [_.get(value, 'receiveInformational', true)],
    });
  }

  findAuthentication(value: string, key: string = 'loginName'): IAutentication | undefined {
    return this.person.authentications ? this.person.authentications.find(auth => auth[key] === value) : undefined;
  }

  addAuthFacebook() {
    this.backupData();
    this.authSrv.signInFacebookProfile();
  }

  addAuthCidadao() {
    this.backupData();
    this.authSrv.signInAcessoCidadaoProfile();
  }

  addAuthGoogle() {
    this.backupData();
    this.authSrv.signInGoogleProfile();
  }

  deleteAuthFacebook() {
    this.person.authentications = this.person.authentications.filter(auth => auth.loginName !== LoginNameEnum.FACEBOOK);
  }

  deleteAuthCidadao() {
    this.person.authentications = this.person.authentications.filter(auth => auth.loginName !== LoginNameEnum.ACESSO_CIDADAO);
  }

  deleteAuthGoogle() {
    this.person.authentications = this.person.authentications.filter(auth => auth.loginName !== LoginNameEnum.GOOGLE);
  }

  addAuthParticipe() {
    this.statusLogin = 'ANDAMENTO';
    if (!this.findAuthentication(LoginNameEnum.PARTICIPE)) {
      this.person.authentications.push({
        loginName: LoginNameEnum.PARTICIPE,
        authenticationType: AuthenticationTypeEnum.EMAIL,
        loginEmail: this.optionsContactEmail[0].value
      });
    }
  }

  deleteAuthParticipe() {
    this.statusLogin = 'DESATIVADO';
    this.person.authentications = this.person.authentications.filter(auth => auth.authenticationType !== LoginNameEnum.PARTICIPE);
  }

  changeAuthParticipe(event) {
    const authIndex = this.person.authentications.findIndex(auth => auth.loginName === LoginNameEnum.PARTICIPE);
    if (authIndex > -1) {
      this.person.authentications[authIndex].loginEmail = event.value;
    }
  }

  backupData() {
    localStorage.setItem('@person.data', JSON.stringify({
      idUser: this.authSrv.getUserInfo.id,
      ...this.userForm.value,
      authentications: this.person.authentications
    }));
  }

  getBackupData() {
    const data = JSON.parse(localStorage.getItem('@person.data'));
    if (data && data.idUser === this.authSrv.getUserInfo.id) {
      this.person = data;
      this.deleteBackupData();
    }
  }

  deleteBackupData() {
    localStorage.removeItem('@person.data');
  }

  async cancel() {
    await this.router.navigate(['/conference-map']);
  }

  private processSocialLoginProfile() {
    try {

      const returnSocial = location.hash.split('=');

      if (Array.isArray(returnSocial) && returnSocial.length === 2) {

        const userInfo = JSON.parse(atob(returnSocial[1])) as ILoginProfileResult;

        if (userInfo.hasRelatedRecord) {
          this.mergeEventData.displayMergeProfileDialog = userInfo.hasRelatedRecord;
          this.mergeEventData.email = userInfo.loginEmail;
          this.mergeEventData.personId = userInfo.personIdAlreadyRelated;
          return;
        }

        const haveAuthentication = this.person.authentications.find(auth => auth.loginName === userInfo.loginName);

        if (!haveAuthentication) {
          this.person.authentications.push(
            {
              loginEmail: userInfo.loginEmail,
              authenticationType: userInfo.loginType,
              loginName: userInfo.loginName,
              idByAuth: userInfo.loginId
            }
          );
        }

        const haveEmail = this.optionsContactEmail.find(email => email.value === userInfo.loginEmail);

        if (!haveEmail) {
          this.optionsContactEmail.push({label: userInfo.loginEmail, value: userInfo.loginEmail});
        }

      }
    } catch (error) {
      console.log('Social login error: ', error);
    }
  }

  validPasswordAndConfirm() {
    const {newPassword, confirmNewPassword} = this.userForm.value;
    if (newPassword && confirmNewPassword) {
      if (newPassword === confirmNewPassword) {
        return true;
      } else {
        this.messageSrv.add({severity: 'warn', detail: 'A senha e a confirmação de senha não são iguais', life: 15000});
        return false;
      }
    } else {
      return true;
    }
  }

  async save() {
    if (!this.validPasswordAndConfirm()) {
      return;
    }
    await this.personSvr.updatePerson(this.authSrv.getUserInfo.id, {
      ...this.userForm.value,
      authentications: this.person.authentications,
      conferenceId: this.conferenceSrv.ConferenceActiveId
    }).then(() => {
      this.messageSrv.add({
        severity: 'success',
        detail: 'Perfil atualizado com sucesso',
        life: 15000
      });
    });
  }

  async wannaMergeProfile(param: { answer: boolean }) {
    if (param.answer) {
      await this.personSvr.mergePersonProfile(this.mergeEventData.personId);

      await this.loadScreen();
    }
    this.mergeEventData.displayMergeProfileDialog = false;
  }
}
