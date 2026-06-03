import {Component, effect, EventEmitter, Input, OnChanges, Output, signal, Signal, SimpleChanges} from '@angular/core';
import {IPerson} from "../../../shared/interfaces/IPerson";
import { PersonService } from 'src/app/shared/services/person.service';
import { MessageService } from 'primeng/api';
import { INewAuthForm } from './newAuthForm.interface';
import {IMeetingDetail} from "../../../shared/interfaces/IMeetingDetail";
import {AuthService} from "../../../shared/services/auth.service";
import { Event } from '@angular/router';
import { ILocality } from 'src/app/shared/interfaces/ILocality';
import { LocalityService } from 'src/app/shared/services/locality.service';
import {MeetingService} from "../../../shared/services/meeting.service";
import {IPreRegistration} from "../../../shared/interfaces/IPreRegistration";
import {IOptionOrganization} from "../../../shared/interfaces/IOptionOrganization";

@Component({
  selector: 'app-authc-step-two',
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent implements OnChanges{
  @Input() user : IPerson = undefined;
  @Input() meeting : IMeetingDetail = undefined;
  @Input() prerregistration : IPreRegistration = undefined;

  @Output() onRegister = new EventEmitter<[INewAuthForm, boolean]>();
  @Output() updatePreRegistration = new EventEmitter<string>();

  lookedOther = false;

  localities: ILocality[] = [];

  filteredOrganizations = signal(this.meetingSrv.organizationList()) ;

  undoCredential = false;

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
      (typeof (this.newAuthForm.organization) === 'string' ? this.newAuthForm.organization : this.newAuthForm.organization?.name )?.length > 0 &&
      this.newAuthForm.authorityRole?.length > 0
    );
  }

  async ngOnChanges(changes: SimpleChanges) {

    const meeting = changes['meeting'].currentValue as IMeetingDetail;
    const user = changes['user'].currentValue as IPerson;
    const prerregistration = changes['prerregistration'].currentValue as IPreRegistration;


    if(!meeting) return;
    if(!user) return;

    this.newAuthForm.madeBy = user.id;
    this.newAuthForm.id = user.id;
    this.newAuthForm.name = user.name;


    await this.reloadUserData();

    if(prerregistration && prerregistration.isAuthority){
      if(this.meetingSrv.organizationList().find(orgIn => orgIn.guid === prerregistration.organization.guid)) {
        this.newAuthForm.organization = this.meetingSrv.organizationList()
          .filter(orgIn => orgIn.guid === prerregistration.organization.guid)[0];
      } else {
        this.newAuthForm.organization = {name: this.prerregistration.organization.name} as IOptionOrganization;
      }

      this.newAuthForm.representing = prerregistration.id === prerregistration.person.id ? 'himself' : 'other';
      if(this.newAuthForm.representing === 'other') {
        this.newAuthForm.authorityRepresenting = prerregistration.person.name;
      }
      this.newAuthForm.authorityLocalityId = prerregistration.localityId;
      this.newAuthForm.authorityRole = prerregistration.role;
      this.newAuthForm.authorityEmail = prerregistration.email;

    }

    const {success, data} = await this.localitySrv.getAllForConference(this.meeting.conference.id);
    if (success) {
      this.localities = data.localities;
    }
  }

  constructor(
    private personService : PersonService,
    private messageService : MessageService,
    private localitySrv: LocalityService,
    private meetingSrv : MeetingService,
  ) {

  }

  async reloadUserData() {

    const {success, data} = await this.personService.getAcRoleById(this.user.id, this.meeting.conference.id);

    if(!success) return;

    this.newAuthForm.organization = data.organization;
    this.newAuthForm.authorityRole = data.role;
    this.newAuthForm.authorityEmail = data.email;
    this.newAuthForm.authorityLocalityId = data.localityId;
    this.newAuthForm.authoritySub = data.sub;

    this.fromAc.organization = !!data.organization
    this.fromAc.authorityRole = !!data.role;
    this.fromAc.authorityEmail = !!data.email;
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

    const {success, data} = await this.personService.findAcInfoByCpf(this.newAuthForm.authorityCpf.replace(/[.-]/g, ''), this.meeting.conference.id);
    if(!success) return;

    this.newAuthForm.organization = data.organization;
    this.newAuthForm.authorityRepresenting = data.name;
    this.newAuthForm.authorityRole = data.role;
    this.newAuthForm.authorityEmail = data.email;
    this.newAuthForm.authorityLocalityId = data.localityId;
    this.newAuthForm.authoritySub = data.authoritySub;


    this.fromAc.authorityRepresenting = !!data.name?.includes(' ');
    this.fromAc.authorityRole = !!data.role;
    this.fromAc.authorityEmail = !!data.email;

    this.updatePreRegistration.emit(data.authoritySub);

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
    this.onRegister.emit([this.newAuthForm, this.undoCredential]);
  }

  filterOrganization(evt: any) {
    const query = evt.query.toLowerCase();

    this.filteredOrganizations.set(this.meetingSrv.organizationList()
      .filter(org => org.name.toLowerCase().includes(query) || org.shortName.toLowerCase().includes(query)));

  }

  emptyList() {
     return [];
  }

}
