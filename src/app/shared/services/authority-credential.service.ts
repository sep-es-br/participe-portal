import {Inject, Injectable, Injector} from "@angular/core";
import {BaseService} from "./base.service";
import {IPreRegistration} from "../interfaces/IPreRegistration";
import {IResultHttp} from "../interfaces/IResultHttp";
import { IPreRegistrationAuthority } from "../interfaces/IPreRegistrationAuthority";

@Injectable({
  providedIn: "root"
})
export class AuthorityCredentialService extends BaseService<any>{

  constructor(
    @Inject(Injector) injector: Injector
  ) {
    super("authorityCredential", injector);
  }

  registerAuthority(
    madeBy, representedByCpf, representedEmail, representedByName,
    email, localityId, meetingId, organization, role
    ) : Promise<IResultHttp<IPreRegistrationAuthority>> {
    const body = {
      madeBy: madeBy,
      representedByCpf: representedByCpf,
      representedByEmail: representedEmail,
      representedByName: representedByName,
      meetingId: meetingId,
      organization: organization,
      role: role,
      email: email,
      localityId: localityId
    };
    return this.http.put<IResultHttp<IPreRegistrationAuthority>>(`${this.urlBase}`, body).toPromise();
  } 

}
