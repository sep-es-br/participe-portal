import {Inject, Injectable, Injector, signal} from "@angular/core";
import {BaseService} from "./base.service";
import {IPreRegistration} from "../interfaces/IPreRegistration";
import {IResultHttp} from "../interfaces/IResultHttp";
import { IPreRegistrationAuthority } from "../interfaces/IPreRegistrationAuthority";

@Injectable({
  providedIn: "root"
})
export class AuthorityCredentialService extends BaseService<any>{

  public readonly isTeamSignal = signal<boolean>(undefined);

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super("authorityCredential", injector);
  }

  registerAuthority(
    madeBy, representedByCpf, representedByEmail, representedByName,
    localityId, meetingId, organization, role, representedBySub,
    isTeam) : Promise<IResultHttp<IPreRegistrationAuthority>> {
    const body = {
      madeBy,
      representedByCpf,
      representedByEmail,
      representedByName,
      representedBySub,
      meetingId,
      organization,
      role,
      localityId,
      isTeam
    };
    return this.http.put<IResultHttp<IPreRegistrationAuthority>>(`${this.urlBase}`, body).toPromise();
  }

  deleteCredential(body: any) {
    return this.http.delete<void>(`${this.urlBase}`, { body }).toPromise();
  }



}
