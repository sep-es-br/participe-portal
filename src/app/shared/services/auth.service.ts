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

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    public http: HttpClient,
    public jwtHelperService: JwtHelperService,
    public router: Router,
    private conferenceSrv: ConferenceService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  private static getFrontFallbackUrl(): string {
    const { protocol, host } = window.location;
    return `${protocol}//${host}`;
  }

  async signIn(login: string, password: string) {
    return this.http.post<IResultHttp<ILoginResult>>(`${environment.apiUrl}/signin?conference=${this.conferenceSrv.ConferenceActiveId}`, {
      login,
      password
    }).toPromise();
  }

  private getUrlForSocialAuth(origin: string, meetingId?: number) {
    return `${environment.apiUrl}/oauth2/authorization/${origin}?front_callback_url=${
      AuthService.getFrontFallbackUrl()}&${ meetingId ? `front_meeting_id=${meetingId}` : `front_conference_id=${this.conferenceSrv.ConferenceActiveId}` }`;
  }


  signInFacebook() {
    /*
    localStorage.setItem(
      StoreKeys.LOGOUT_URI,
      environment.logoutURIFacebook
    );
    */
    this.document.location.href = this.getUrlForSocialAuth('facebook');
  }

  signInFacebookProfile() {
    this.document.location.href = this.getUrlForSocialAuth('facebook-profile');
  }

  signInGoogle() {
    // localStorage.setItem(StoreKeys.LOGOUT_URI, environment.logoutURIGoogle);
    this.document.location.href = this.getUrlForSocialAuth('google');
  }

  signInGoogleProfile() {
    this.document.location.href = this.getUrlForSocialAuth('google-profile');
  }


  signInAcessoCidadao(meetingId? : number) {
    localStorage.setItem(
      StoreKeys.LOGOUT_URI,
      environment.logoutURIAcessoCidadao
    );
    this.document.location.href = this.getUrlForSocialAuth('portal', meetingId);
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
      return false;
    }
  }

  async signOut() {
    const logoutURI = localStorage.getItem(StoreKeys.LOGOUT_URI);
    if (logoutURI !== null) {
      this.clearTokens();
      window.location.href = logoutURI;
    } else {
      await this.router.navigate(['']);
      debugger;
      this.clearTokens();
    }
  }

  saveToken(data: ISocialLoginResult | ILoginResult) {
    localStorage.setItem(StoreKeys.ACCESS_TOKEN, data.token);
    localStorage.setItem(StoreKeys.REFRESH_TOKE, data.refreshToken);
  }

  saveUserInfo(data: IPerson) {
    localStorage.setItem(StoreKeys.USER_INFO, JSON.stringify(data));
  }

  clearTokens(ignoreConference?: boolean) {

    localStorage.removeItem(StoreKeys.ACCESS_TOKEN);
    localStorage.removeItem(StoreKeys.REFRESH_TOKE);
    localStorage.removeItem(StoreKeys.IS_PROFILE_INCOMPLETED);
    localStorage.removeItem(StoreKeys.LOGOUT_URI);
    if (!ignoreConference){
      localStorage.removeItem(StoreKeys.CONFERENCE_ACTIVE);
    }
  }

  getAccessToken() {
    return localStorage.getItem(StoreKeys.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(StoreKeys.REFRESH_TOKE);
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
