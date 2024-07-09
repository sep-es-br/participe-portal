import * as _ from 'lodash';

import {Component, OnInit} from '@angular/core';
import {MessageService, SelectItem} from 'primeng/api';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

import {AuthService} from '../../shared/services/auth.service';
import {ConferenceService} from '../../shared/services/conference.service';
import {ILocality} from '../../shared/interfaces/ILocality';
import {IPerson} from '../../shared/interfaces/IPerson';
import {LocalityService} from '../../shared/services/locality.service';
import {PersonService} from 'src/app/shared/services/person.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StoreKeys} from '../../shared/commons/contants';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {

  userForm: UntypedFormGroup;
  localities: ILocality[] = [];
  filteredLocalities: SelectItem[];
  localityType: string;
  accreditation: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private localitySrv: LocalityService,
    private authSrv: AuthService,
    private personSrv: PersonService,
    private conferenceSrv: ConferenceService,
    private messageSrv: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.accreditation = Boolean(this.route.snapshot.queryParams['accreditation']) ?? false
  }

  async ngOnInit() {
    await this.setForm(this.authSrv.getUserInfo);
    await this.loadLocalities();
  }


  async loadLocalities() {
    const {success, data} = await this.localitySrv.getAllForConference(this.conferenceSrv.ConferenceActiveId);
    if (success) {
      this.localityType = data.nameType;
      this.localities = data.localities;
    }
  }

  async setForm(value) {
    this.userForm = this.formBuilder.group({
      id: value.id,
      name: [_.get(value, 'name', ''), Validators.required],
      contactEmail: [_.get(value, 'contactEmail', ''), Validators.required],
      telephone: [_.get(value, 'telephone', '')],
      locality: [_.get(value, 'locality', ''), Validators.required],
      receiveInformational: true,
    });
  }


  async save({id, name, contactEmail, telephone, locality, receiveInformational}) {
    const sender: IPerson = {
      id, name, contactEmail, telephone, receiveInformational,
      selfDeclaration: {
        conference: this.conferenceSrv.ConferenceActiveId,
        locality: locality,
      }
    };

    const {success} = await this.personSrv.complementPerson(sender);
    if (success) {

      if(sessionStorage.getItem(StoreKeys.CHECK_IN)){
        localStorage.removeItem(StoreKeys.IS_PROFILE_INCOMPLETED);
        await this.router.navigate([`/self-check-in/${localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE)}/meeting/${sessionStorage.getItem(StoreKeys.CHECK_IN)}`]);
      }else if(sessionStorage.getItem(StoreKeys.PRE_REGISTRATION) || sessionStorage.getItem(StoreKeys.PRE_REGISTRATION_MEETING_STARTED)){
        localStorage.removeItem(StoreKeys.IS_PROFILE_INCOMPLETED);
        localStorage.removeItem(StoreKeys.REDIRECT_URL)
        const meeting = sessionStorage.getItem(StoreKeys.PRE_REGISTRATION) ?? sessionStorage.getItem(StoreKeys.PRE_REGISTRATION_MEETING_STARTED)
        await this.router.navigate([`/registration/${localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE)}/meeting/${meeting}`]);
      }else{
        localStorage.removeItem(StoreKeys.IS_PROFILE_INCOMPLETED);
        await this.router.navigate(['/conference-map']);
      }

    }
  }

  filterLocalities({query}) {
    this.filteredLocalities = [];
    this.filteredLocalities = this.localities && this.localities.filter(
      locality => locality.name.toLowerCase().indexOf(query.toLowerCase()) > -1
    ).map(loc => ({value: loc.id, label: loc.name}));
  }

  async cancel() {
    localStorage.removeItem(StoreKeys.IS_PROFILE_INCOMPLETED);
    sessionStorage.removeItem(StoreKeys.PRE_REGISTRATION_MEETING_STARTED)
    await this.router.navigate(['/login', this.conferenceSrv.ConferenceActiveId]);
  }

}
