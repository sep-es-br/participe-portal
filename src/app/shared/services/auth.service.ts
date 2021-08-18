import { ILoginResult } from '../interfaces/ILoginResult';
import { IResultHttp } from '../interfaces/IResultHttp';
import { IPerson } from '../interfaces/IPerson';
import { ISocialLoginResult } from '../interfaces/ISocialLoginResult';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { StoreKeys } from '../commons/contants';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ConferenceService } from './conference.service';

import * as jwtDecode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    public http: HttpClient,
    public jwtHelperService: JwtHelperService,
    public router: Router,
    private conferenceSrv: ConferenceService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  async signIn(login: string, password: string) {
    return this.http.post<IResultHttp<ILoginResult>>(`${environment.apiUrl}/signin?conference=${this.conferenceSrv.ConferenceActiveId}`, {
      login,
      password
    }).toPromise();
  }

  private getUrlForSocialAuth(origin: string) {
    return `${environment.apiUrl}/oauth2/authorization/${origin}?front_callback_url=${
      AuthService.getFrontFallbackUrl()}&front_conference_id=${this.conferenceSrv.ConferenceActiveId}`;
  }

  signInFacebook() {
    this.document.location.href = this.getUrlForSocialAuth('facebook');
  }

  signInFacebookProfile() {
    this.document.location.href = this.getUrlForSocialAuth('facebook-profile');
  }

  signInGoogle() {
    this.document.location.href = this.getUrlForSocialAuth('google');
  }

  signInGoogleProfile() {
    this.document.location.href = this.getUrlForSocialAuth('google-profile');
  }

  signInAcessoCidadao() {
    this.document.location.href = this.getUrlForSocialAuth('portal');
  }

  signInAcessoCidadaoProfile() {
    this.document.location.href = this.getUrlForSocialAuth('portal-profile');
  }

  async refresh() {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        const { success, data } = await this.http.get<IResultHttp<ISocialLoginResult>>(
          `${environment.apiUrl}/signin/refresh?refreshToken=${refreshToken}`
        ).toPromise();
        if (success) {
          this.saveToken(data);
        }
      }
      return true;
    } catch (err) {
    }
    this.clearTokens();
    return false;
  }

  async signOut() {
    this.clearTokens();
    await this.router.navigate(['/login']);
  }

  saveToken(data: ISocialLoginResult | ILoginResult) {
    localStorage.setItem(StoreKeys.ACCESS_TOKEN, data.token);
    localStorage.setItem(StoreKeys.REFRESH_TOKE, data.refreshToken);
  }

  saveUserInfo(data: IPerson) {
    localStorage.setItem(StoreKeys.USER_INFO, JSON.stringify(data));
  }

  clearTokens() {
    localStorage.removeItem(StoreKeys.ACCESS_TOKEN);
    localStorage.removeItem(StoreKeys.REFRESH_TOKE);
    localStorage.removeItem(StoreKeys.IS_PROFILE_INCOMPLETED);
    localStorage.removeItem(StoreKeys.CONFERENCE_ACTIVE);
  }

  getAccessToken() {
    return localStorage.getItem(StoreKeys.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(StoreKeys.REFRESH_TOKE);
  }

  getTokenPayload() {
    return jwtDecode(this.getAccessToken());
  }

  private static getFrontFallbackUrl(): string {
    const { protocol, host } = window.location;
    return `${protocol}//${host}`;
  }

  get getUserInfo(): IPerson {
    try {
      return JSON.parse(localStorage.getItem(StoreKeys.USER_INFO)) as IPerson;
    } catch (error) {
      return {} as IPerson;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      const notExpired = !this.jwtHelperService.isTokenExpired(accessToken);

      if (notExpired) {
        return true;
      }

      if (await this.refresh()) {
        return true;
      }
    }
    return false;
  }

}
