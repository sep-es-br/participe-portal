import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StoreKeys } from "src/app/shared/commons/contants";
import { AuthService } from "src/app/shared/services/auth.service";


@Component({
    selector: 'app-login-self-check-in',
    templateUrl: './login-self-check-in.component.html',
    styleUrls: ['./login-self-check-in.component.scss']
})
export class LoginSelfCheckInComponent implements OnInit {

    constructor(
        private authSrv: AuthService,
        private route: ActivatedRoute,
    ){}

    
    async ngOnInit() {
      sessionStorage.setItem(StoreKeys.CHECK_IN, String(this.route.snapshot.params['meeting']));
      this.signInAcessoCidadao();
    }

    signInAcessoCidadao() {
        this.authSrv.signInAcessoCidadao();
      }

}

