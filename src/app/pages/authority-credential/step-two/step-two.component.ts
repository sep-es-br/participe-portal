import {Component, computed, effect, EventEmitter, Input, OnInit, Output, signal, Signal} from '@angular/core';
import {IPerson} from "../../../shared/interfaces/IPerson";
import {IMeetingDetail} from "../../../shared/interfaces/IMeetingDetail";
import {AuthService} from "../../../shared/services/auth.service";
import { PersonService } from 'src/app/shared/services/person.service';
import { MessageService } from 'primeng/api';
import { INewAuthForm } from './newAuthForm.interface';
import { Event } from '@angular/router';
import { ILocality } from 'src/app/shared/interfaces/ILocality';
import { LocalityService } from 'src/app/shared/services/locality.service';

@Component({
  selector: 'app-authc-step-two',
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {
  @Input() user : Signal<IPerson> = signal<IPerson>(undefined);
  @Input() meeting : Signal<IMeetingDetail> = signal<IMeetingDetail>(undefined);

  @Output() onRegister = new EventEmitter<INewAuthForm>();

  localities: ILocality[] = [];

  newAuthForm : INewAuthForm = {
    madeBy : undefined,
    id: undefined,
    sub: undefined,
    name: undefined,
    organization: undefined,
    representing: 'himself' as 'himself' | 'other' | 'none',
    authorityCpf: undefined,
    authorityEmail: undefined,
    authorityLocalityId: undefined,
    authorityRepresenting: undefined,
    authorityRole: undefined,
    notRepresentingReason: undefined
  }

  fromAc = {
    authorityRepresenting: false,
    authorityRole: false
  }

  constructor(
    private personService : PersonService,
    private messageService : MessageService,
    private localitySrv: LocalityService
  ) {
    effect(() => {
        if(!this.user())
            return;
        
        this.newAuthForm.madeBy = this.user().id;
        this.newAuthForm.id = this.user().id;
        this.newAuthForm.name = this.user().name;

        this.personService.getSubById(this.user().id).then(
          resp => {
            if(Array.isArray(resp.data)) return;

            this.newAuthForm.sub = resp.data.sub;
          }
        )

        this.personService.getAcRoleById(this.user().id, this.meeting().conference.id).then(acRole => {
          if(Array.isArray(acRole.data)) return;

          this.newAuthForm.organization = acRole.data.organization;
          this.newAuthForm.authorityRole = acRole.data.role;
          this.newAuthForm.authorityEmail = acRole.data.email;
          this.newAuthForm.authorityLocalityId = acRole.data.localityId;
          
          this.fromAc.authorityRole = !!acRole.data.role;
        });

      });
    effect(async () => {
      if(!this.meeting()) return;
      const {success, data} = await this.localitySrv.getAllForConference(this.meeting().conference.id);
      if (success) {
        this.localities = data.localities;
      }      
    })
  }

  async otherSelecionado(evt : any) {
    this.newAuthForm.authorityRole = undefined;
    this.fromAc.authorityRole = false;
  }

  async loadAcInfo() {
    if(!this.validarCpf(this.newAuthForm.authorityCpf)){
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Favor inserir um CPF válido',
        life: 15000
      });
      return;
    }

    const acInfo = await this.personService.findAcInfoByCpf(this.newAuthForm.authorityCpf.replace(/[.-]/g, ''), this.meeting().conference.id);
    if(Array.isArray(acInfo.data)) return;

    this.newAuthForm.authorityRepresenting = acInfo.data.name;
    this.newAuthForm.authorityRole = acInfo.data.role;
    this.newAuthForm.authorityEmail = acInfo.data.email;
    this.newAuthForm.authorityLocalityId = acInfo.data.localityId;

    
    this.fromAc.authorityRepresenting = acInfo.data.name.includes(' ');
    this.fromAc.authorityRole = !!acInfo.data.role;
  }

  validarCpf(cpf: string): boolean {
    if (!cpf) return false;

    // Remove tudo que não é número
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    // Elimina CPFs com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    const calcularDigito = (base: string, pesoInicial: number): number => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base[i]) * (pesoInicial - i);
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const base = cpf.substring(0, 9);
    const digito1 = calcularDigito(base, 10);
    const digito2 = calcularDigito(base + digito1, 11);

    return cpf === base + digito1 + digito2;
  }

  finishRegister() {
    this.onRegister.emit(this.newAuthForm);
  }

}
