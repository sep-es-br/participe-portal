import { Router } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { ISocialLoginResult } from './../../shared/interfaces/ISocialLoginResult';
import { browser } from 'protractor';
import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authSrv: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.processSocialLogin();
  }

  private processSocialLogin() {
    try {
      const returnSocial = location.hash.split('=');
      if (Array.isArray(returnSocial) && returnSocial.length === 2) {
        const userInfo = JSON.parse(atob(returnSocial[1])) as ISocialLoginResult;
        this.authSrv.saveToken(userInfo);
        this.authSrv.saveUserInfo(userInfo.person);
        if (userInfo.completed) {
          this.router.navigate(['/conference-map']);
        } else {
          this.router.navigate(['/complete-profile']);
        }
      }
    } catch (error) {
      console.log('Social login error: ', error);
    }
  }

}
