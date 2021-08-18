import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ILoginScreenInfo } from 'src/app/shared/interfaces/IConferenceActive';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConferenceService } from 'src/app/shared/services/conference.service';

@Component({
  selector: 'app-post-closure',
  templateUrl: './post-closure.component.html',
  styleUrls: ['./post-closure.component.scss']
})
export class PostClosureComponent implements OnInit {

  data: ILoginScreenInfo;
  form: any = {};
  conferenceId: number;
  postClosureText: string = '';

  constructor(
    private conferenceSrv: ConferenceService,
    private activeRoute: ActivatedRoute,
    private authSrv: AuthService,
    private messageSrv: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(async ({ conference }) => {
      this.conferenceId = +conference;
      await this.getText();
    });
  }

  async getText() {
    const { success, data } = await this.conferenceSrv.getConferencePostClosureScreenInfo(this.conferenceId);
    if (success) {
      this.postClosureText = data.text;
    }
  }

  changeToLoginForm() {
    document.getElementById('left-side').style.display = 'none';
    document.getElementById('login-mobile').style.display = 'none';
    document.getElementById('right-side').style.display = 'flex';
  }

  signInFacebook() {
    this.authSrv.signInFacebook();
  }

  signInGoogle() {
    this.authSrv.signInGoogle();
  }

  signInAcessoCidadao() {
    this.authSrv.signInAcessoCidadao();
  }

  async signInWithLogin({ login, password }) {
    if (!login || !password) {
      return this.messageSrv.add({ severity: 'warn', detail: 'Informe o login e senha para efetuar o login', life: 15000 });
    }
    const { success, data } = await this.authSrv.signIn(login, password);
    if (success) {
      this.authSrv.saveToken(data);
      this.authSrv.saveUserInfo(data.person);
      if (!data.completed) {
        return this.router.navigate(['/complete-profile']);
      }
      if (data.temporaryPassword) {
        return this.router.navigate(['/change-password']);
      }
    }
  }
}
