import * as _ from 'lodash';

import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MessageService, SelectItem} from 'primeng/api';
import {ConferenceService} from '../../shared/services/conference.service';
import {ILocality} from '../../shared/interfaces/ILocality';
import {IPerson} from '../../shared/interfaces/IPerson';
import {LocalityService} from '../../shared/services/locality.service';
import {PersonService} from '../../shared/services/person.service';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm: UntypedFormGroup;
  localities: ILocality[] = [];
  filteredLocalities: SelectItem[];
  localityType: string;
  tokenRecaptcha: string;

  siteKey: string = _.get(environment, 'siteKey') ? _.get(environment, 'siteKey') : '6LfvfAEVAAAAAFEiE8bzs3d47SKNl3iJFxvAfV83';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private localitySrv: LocalityService,
    private personSrv: PersonService,
    private conferenceSrv: ConferenceService,
    private router: Router,
    private messageSrv: MessageService
  ) {
  }

  async ngOnInit() {
    this.setForm({});
    await this.loadLocalities();
  }


  async loadLocalities() {
    const {success, data} = await this.localitySrv.getAllForConference(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.localityType = data.nameType;
      this.localities = data.localities;
    }
  }

  setForm(value) {
    this.userForm = this.formBuilder.group({
      name: [_.get(value, 'name', ''), Validators.required],
      contactEmail: [_.get(value, 'contactEmail', ''), [Validators.required, Validators.email]],
      confirmEmail: [_.get(value, 'confirmEmail', ''), [Validators.required, Validators.email]],
      telephone: [_.get(value, 'telephone', '')],
      locality: [_.get(value, 'locality', ''), Validators.required]
    });
  }


  async save({name, contactEmail, confirmEmail, telephone, locality}) {

    if (!this.tokenRecaptcha) {
      return this.messageSrv.add({severity: 'warn', detail: 'Você precisa resolver o captcha para continuar!', life: 15000});
    }

    if (!_.get(locality, 'value')) {
      return this.messageSrv.add({severity: 'warn', detail: 'O município informado é inválido.', life: 15000});
    }

    const sender: IPerson = {
      name, contactEmail, confirmEmail, telephone,
      selfDeclaration: {
        conference: this.conferenceSrv.ConferenceActiveId,
        locality: _.get(locality, 'value'),
      }
    };

    const {success} = await this.personSrv.register(sender, this.tokenRecaptcha);
    if (success) {
      setTimeout(() => {
        this.messageSrv.add({
          severity: 'success',
          detail: `Dentro de instantes você receberá uma mensagem em seu email ${contactEmail} com a sua senha provisória.
           Utilize-a para entrar e criar a sua senha definitiva`,
          life: 15000
        });
      }, 1000);
      await this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
    }
    grecaptcha.reset();
  }

  filterLocalities({query}) {
    this.filteredLocalities = [];
    this.filteredLocalities = this.localities.filter(
      locality => locality.name.toLowerCase().indexOf(query.toLowerCase()) > -1
    ).map(loc => ({value: loc.id, label: loc.name}));
  }

  async cancel() {
    await this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
  }

  resolveCaptcha(event) {
    this.tokenRecaptcha = event;
  }
}
