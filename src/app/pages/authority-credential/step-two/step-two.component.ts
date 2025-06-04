import {Component, effect, EventEmitter, Input, Output, signal, Signal} from '@angular/core';
import {IPerson} from "../../../shared/interfaces/IPerson";
import { PersonService } from 'src/app/shared/services/person.service';
import { MessageService } from 'primeng/api';
import { INewAuthForm } from './newAuthForm.interface';

@Component({
  selector: 'app-authc-step-two',
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {
  @Input() user : Signal<IPerson> = signal<IPerson>(undefined);

  @Output() onRegister = new EventEmitter<INewAuthForm>();

  newAuthForm : INewAuthForm = {
    id: undefined,
    sub: undefined,
    name: undefined,
    organization: undefined,
    representing: 'himself' as 'himself' | 'other' | 'none',
    authorityCpf: undefined,
    authorityEmail: undefined,
    authorityRepresenting: undefined,
    authorityRole: undefined,
    notRepresentingReason: undefined
  }

  fromAc = {
    authorityRepresenting: false,
    authorityRole: false
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
    private messageService : MessageService
  ) {
    effect(() => {
        if(!this.user())
            return;
        this.newAuthForm.id = this.user().id;
        this.newAuthForm.name = this.user().name;

        this.personService.getSubById(this.user().id).then(
          resp => {
            if(Array.isArray(resp.data)) return;

            this.newAuthForm.sub = resp.data.sub;
          }
        )

        this.personService.getAcRoleById(this.user().id).then(acRole => {
          if(Array.isArray(acRole.data)) return;

          this.newAuthForm.organization = acRole.data.organization;
          this.newAuthForm.authorityRole = acRole.data.role;
          this.fromAc.authorityRole = !!acRole.data.role;
        });

      })
  }

  async otherSelecionado() {
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

    const acInfo = await this.personService.findAcInfoByCpf(this.newAuthForm.authorityCpf.replace(/[.-]/g, ''));
    if(Array.isArray(acInfo.data)) return;

    this.newAuthForm.authorityRepresenting = acInfo.data.name;
    this.fromAc.authorityRepresenting = acInfo.data.name.includes(' ');
    this.newAuthForm.authorityRole = acInfo.data.role;
    this.fromAc.authorityRole = !!acInfo.data.role;
    this.newAuthForm.authorityEmail = acInfo.data.email;
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
