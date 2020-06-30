import { ILocality } from './../interfaces/ILocality';
import { ParticipationStateModel } from './../models/ParticipationStateModel';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { INavigation } from '../interfaces/INavigation';
import { StoreKeys } from '../commons/contants';

@Injectable({ providedIn: 'root' })
export class ParticipationStateService {

  state: ParticipationStateModel = new ParticipationStateModel();
  subState: Subject<ParticipationStateModel> = new Subject<ParticipationStateModel>();

  constructor(
  ) {
    this.init();
  }

  private init() {
    try {
      this.state = JSON.parse(localStorage.getItem(StoreKeys.PARTICIPATION_STATE)) as ParticipationStateModel;
    } catch (error) {
      this.state = new ParticipationStateModel();
    }
    this.subState.next(this.state);
  }

  private persisteState() {
    localStorage.setItem(StoreKeys.PARTICIPATION_STATE, JSON.stringify(this.state));
  }

  setLocality(locality: ILocality) {
    this.state.locality = locality;
    this.subState.next(this.state);
    this.persisteState();
  }

  addNavigation(item: INavigation) {
    if (!Array.isArray(this.state.navigation)) { this.state.navigation = []; }
    const foundIndex = this.state.navigation.findIndex(nav => nav.label === item.label);
    if (foundIndex === -1) {
      this.state.navigation = _.concat(this.state.navigation, [{ ...item }]);
    } else {
      this.state.navigation[foundIndex] = item;
    }
    this.subState.next(this.state);
    this.persisteState();
  }

  clear() {
    localStorage.removeItem(StoreKeys.PARTICIPATION_STATE);
    this.state = new ParticipationStateModel();
    this.subState.next(this.state);
  }

  clearNavigation() {
    this.state.navigation = [];
    this.subState.next(this.state);
    this.persisteState();
  }

  removeLast() {
    if (Array.isArray(this.state.navigation)) {
      const last = _.last(this.state.navigation);
      this.state.navigation = this.state.navigation.filter(nav => nav.label !== last.label);
    }
    this.subState.next(this.state);
    this.persisteState();
  }

  removeBeforeNavigation(labelNavigation: string) {
    const foundIndex = _.get(this.state, 'navigation', []).findIndex(nav => nav.label === labelNavigation);
    if (foundIndex > -1) {
      // Remove all navigation before label inputed
      this.state.navigation = this.state.navigation.filter((nav, index) => index <= foundIndex);

      // Get last index for remove nav choice
      const finalIndex = _.findLastIndex(this.state.navigation);
      if (finalIndex > -1) {
        this.state.navigation[finalIndex].nav = undefined;
      }

      // Propagate changes
      this.subState.next(this.state);
      this.persisteState();
    }
  }

  get(): Observable<ParticipationStateModel> {
    setTimeout(() => {
      this.subState.next(this.state);
    }, 200);
    return this.subState.asObservable();
  }

  getSync(): ParticipationStateModel {
    return this.state;
  }

}
