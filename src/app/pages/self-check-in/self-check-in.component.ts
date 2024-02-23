import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
    selector: 'app-self-check-in',
    templateUrl: './self-check-in.component.html',
    styleUrls: ['./self-check-in.component.scss']
})
export class SelfCheckIn implements OnInit {

    constructor(
        private authSrv: AuthService,
    ){}

    
    async ngOnInit() {
        this.signInAcessoCidadao()
        
    }

    signInAcessoCidadao() {
        this.authSrv.signInAcessoCidadao();
      }

}

