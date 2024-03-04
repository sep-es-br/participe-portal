import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {ISocialLoginResult} from '../../shared/interfaces/ISocialLoginResult';
import {Component, OnInit} from '@angular/core';
import {StoreKeys} from '../../shared/commons/contants';
import {MessageService} from 'primeng/api';
import {ConferenceService} from '../../shared/services/conference.service';
import { IConference } from 'src/app/shared/interfaces/IConference';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  conference: IConference;
  regionalization: boolean;

  constructor(
    private authSrv: AuthService,
    private messageSrv: MessageService,
    private conferenceSrv: ConferenceService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.loadConference();
    await this.processSocialLogin();
  }

  async loadConference() {
    const result = await this.conferenceSrv.GetByUrl(document.location.href);
    if (result.success && !(result.data instanceof Array)) {
      this.conference = result.data;
    }
  }


  private async processSocialLogin() {
    try {
      const returnSocial = location.hash.split('=');
      if (Array.isArray(returnSocial) && returnSocial.length === 2) {
        const userInfo = JSON.parse(decodeURIComponent(escape(atob(returnSocial[1])))) as ISocialLoginResult;

        if (!userInfo.person.contactEmail) {

          setTimeout(() => {
            this.messageSrv.add({
              severity: 'warn',
              detail: `Suas configurações de segurança do ${userInfo.authServiceName} não permitem o compartilhamento
               do seu endereço de email com o sistema Participe. Revise suas configurações no ${userInfo.authServiceName}
               ou escolha outra forma de autenticação.`,
              life: 15000
            });
          }, 1000);
          await this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
          return;
        }

        this.authSrv.saveToken(userInfo);
        this.authSrv.saveUserInfo(userInfo.person);

        const urlRedirect = localStorage.getItem(StoreKeys.REDIRECT_URL);


        if (userInfo.completed) {
          if(urlRedirect != ''){
            console.log('Vai fazer redirect',urlRedirect);
            await this.router.navigate([urlRedirect]);
          }else if (this.conference.displayStatusConference === 'OPEN') {
            const { data } = await this.conferenceSrv.getRegionalization(this.conferenceSrv.ConferenceActiveId);
            if (data.regionalization) {
              await this.router.navigate(['/conference-map']);
            } else {
              await this.router.navigate(['/conference-steps']);
            }
          } else {
            await this.router.navigate(['/proposals']);
          }
        } else {
          localStorage.setItem(StoreKeys.IS_PROFILE_INCOMPLETED, String(!userInfo.completed));
          await this.router.navigate(['/complete-profile']);
        }
      }
    } catch (error) {
      console.log('Social login error: ', error);
    }
  }

}
