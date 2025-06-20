import {Component, effect, EventEmitter, Input, Output, signal, Signal} from '@angular/core';
import {IPerson} from "../../../shared/interfaces/IPerson";
import { PersonService } from 'src/app/shared/services/person.service';
import { MessageService } from 'primeng/api';
import { INewAuthForm } from './newAuthForm.interface';
import {IMeetingDetail} from "../../../shared/interfaces/IMeetingDetail";
import {AuthService} from "../../../shared/services/auth.service";
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

  lookedOther = false;

  localities: ILocality[] = [];

  newAuthForm : INewAuthForm = {
    madeBy : undefined,
    id: undefined,
    name: undefined,
    organization: undefined,
    representing: 'himself' as 'himself' | 'other' | 'none',
    authorityCpf: undefined,
    authoritySub: undefined,
    authorityEmail: undefined,
    authorityLocalityId: undefined,
    authorityRepresenting: undefined,
    authorityRole: undefined,
    notRepresentingReason: undefined
  }

  fromAc = {
    organization: false,
    authorityRepresenting: false,
    authorityRole: false,
    authorityEmail: false
  }

  get isAuthValid(): boolean {
    const firstPart: boolean =
      this.newAuthForm.representing === 'other' ?
        (
          this.newAuthForm.authorityCpf?.length > 0 &&
          this.newAuthForm.authorityRepresenting?.length > 0
        )
      : true;
    // ↳ Caso o usuário tenha selecionado que outra pessoa será o representante, precisa verificar
    // ↳ se os campos de CPF e Nome do representante estão preenchidos
    
    return (
      firstPart &&
      this.newAuthForm.name?.length > 0 &&
      this.newAuthForm.organization?.length > 0 &&
      this.newAuthForm.authorityRole?.length > 0
    );
  }

  constructor(
    private personService : PersonService,
    private messageService : MessageService,
    private localitySrv: LocalityService
  ) {
    effect(async () => {
      if(!this.meeting()) return;
      if(!this.user()) return;
        
      this.newAuthForm.madeBy = this.user().id;
      this.newAuthForm.id = this.user().id;
      this.newAuthForm.name = this.user().name;

      this.reloadUserData();
      const {success, data} = await this.localitySrv.getAllForConference(this.meeting().conference.id);
      if (success) {
        this.localities = data.localities;
      }      
    })
  }

  reloadUserData() {
    this.personService.getAcRoleById(this.user().id, this.meeting().conference.id).then(acRole => {
        const {success, data} = acRole;
        
        if(!success) return;

        this.newAuthForm.organization = data.organization;
        this.newAuthForm.authorityRole = data.role;
        this.newAuthForm.authorityEmail = data.email;
        this.newAuthForm.authorityLocalityId = data.localityId;
        this.newAuthForm.authoritySub = data.sub;
        
        this.fromAc.organization = !!data.organization
        this.fromAc.authorityRole = !!data.role;
        this.fromAc.authorityEmail = !!data.email;
      });
  }

  async himselfSelected() {
    this.reloadUserData();

    this.newAuthForm.authorityCpf = undefined;
    this.newAuthForm.authorityRepresenting = undefined;

    this.fromAc.authorityRepresenting = false;
    this.lookedOther = false;
  }

  async otherSelected() {
    this.newAuthForm.authorityRole = undefined;
    this.fromAc.authorityRole = false;
  }

  get isOtherAndLooked() : boolean {
    return this.newAuthForm.representing === 'himself' || (this.newAuthForm.representing === 'other' && this.lookedOther);
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

    const {success, data} = await this.personService.findAcInfoByCpf(this.newAuthForm.authorityCpf.replace(/[.-]/g, ''), this.meeting().conference.id);
    if(!success) return;

    this.newAuthForm.authorityRepresenting = data.name;
    this.newAuthForm.authorityRole = data.role;
    this.newAuthForm.authorityEmail = data.email;
    this.newAuthForm.authorityLocalityId = data.localityId;
    this.newAuthForm.authoritySub = data.authoritySub;

    
    this.fromAc.authorityRepresenting = !!data.name?.includes(' ');
    this.fromAc.authorityRole = !!data.role;
    this.fromAc.authorityEmail = !!data.email;

    this.lookedOther = true;
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
