import {Inject, Injectable, Injector} from "@angular/core";
import {BaseService} from "./base.service";
import {IPreRegistration} from "../interfaces/IPreRegistration";
import {IResultHttp} from "../interfaces/IResultHttp";

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
    meetingId, organization, role
    ) : Promise<IResultHttp<IPreRegistration>> {
    const body = {
      madeBy: madeBy,
      representedByCpf: representedByCpf,
      representedByEmail: representedEmail,
      representedByName: representedByName,
      meetingId: meetingId,
      organization: organization,
      role: role
    };
    return this.http.put<IPreRegistration>(`${this.urlBase}`, body).toPromise();
  }

}
