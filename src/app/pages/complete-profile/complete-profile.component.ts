import { Router } from '@angular/router';
import { IPerson } from './../../shared/interfaces/IPerson';
import { ConferenceService } from './../../shared/services/conference.service';
import { AuthService } from './../../shared/services/auth.service';
import { LocalityService } from './../../shared/services/locality.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { PersonService } from 'src/app/shared/services/person.service';
import * as _ from 'lodash';
import { ILocality } from '../../shared/interfaces/ILocality';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {

  userForm: FormGroup;
  localities: ILocality[] = [];
  filteredLocalities: SelectItem[];
  localityType: string;

  constructor(
    private formBuilder: FormBuilder,
    private localitySrv: LocalityService,
    private authSrv: AuthService,
    private personSrv: PersonService,
    private conferenceSrv: ConferenceService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.setForm(this.authSrv.getUserInfo);
    this.loadLocalities();
  }


  async loadLocalities() {
    const { success, data } = await this.localitySrv.getAllForConference(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.localityType = data.nameType;
      this.localities = data.localities;
    }
  }

  setForm(value) {
    this.userForm = this.formBuilder.group({
      name: [_.get(value, 'name', ''), Validators.required],
      contactEmail: [_.get(value, 'contactEmail', ''), Validators.required],
      telephone: [_.get(value, 'telephone', '')],
      locality: [_.get(value, 'locality', ''), Validators.required]
    });
  }


  async save({ name, contactEmail, telephone, locality }) {
    const sender: IPerson = {
      name, contactEmail, telephone,
      selfDeclaretion: {
        conference: { id: this.conferenceSrv.ConferenceActiveId },
        locality: { id: _.get(locality, 'value') }
      }
    };

    const { success } = await this.personSrv.complementPerson(sender);
    if (success) {
      this.router.navigate(['/conference-map']);
    }
  }

  filterLocalities({ query }) {
    this.filteredLocalities = [];
    this.filteredLocalities = this.localities.filter(
      locality => locality.name.toLowerCase().indexOf(query.toLowerCase()) > -1
    ).map(loc => ({ value: loc.id, label: loc.name }));
  }

  cancel() {
    this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
  }

}
