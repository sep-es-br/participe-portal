import { ParticipationStateModel } from '../models/ParticipationStateModel';
import { Subject, Observable, Subscription } from 'rxjs';
import { IBreadcrumbItem } from '../../components/breadcrumb/breadcrumb.component';
import { Injectable, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { ParticipationStateService } from './participation-state.service';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService implements OnDestroy {

  items: IBreadcrumbItem[] = [];
  subItems: Subject<any> = new Subject<any>();
  subState: Subscription;

  constructor(
    private participationStateSrv: ParticipationStateService
  ) {
    this.subState = this.participationStateSrv.get().subscribe(state => {
      this.init(state);
    });
  }

  ngOnDestroy(): void {
    if (this.subState) {
      this.subState.unsubscribe();
    }
  }


  init(state?: ParticipationStateModel) {
    if (this.items.length > 0) {
      this.items[0].subTitle = _.get(state, 'locality.name');
      this.items[0].route = ['/conference-map'];
      for (let i = this.items.length - 1; i > 0; i-- ) {
        this.items.pop();
      }
    }
    _.forEach(
      _.get(state, 'navigation', [])
      , (navigate, index) => {
        this.items.push({
          title: navigate.label,
          subTitle: _.get(navigate, 'nav.name'),
          route: [`/conference-steps`],
          queryParams: { id:  _.get(state, `navigation[${index - 1}].nav.id`) }
        });
      });
    this.subItems.next(this.items);
  }

  add(item: IBreadcrumbItem) {
    if (this.items.findIndex(i => i.title === item.title) === -1) {
      this.items.push(item);
    }
    this.subItems.next(this.items);
  }

  addOrUpdate(item: IBreadcrumbItem) {
    const index = this.items.findIndex(i => i.title === item.title);
    if (index === -1) {
      this.items.push(item);
    } else {
      this.items[index] = item;
    }
    this.subItems.next(this.items);
  }

  updateLast(item: IBreadcrumbItem) {
    const index = this.items.length - 1;
    this.items[index] = item;
    this.subItems.next(this.items);
  }

  update(item: IBreadcrumbItem, index: number) {
    this.items[index] = item;
    this.subItems.next(this.items);
  }

  get(): Observable<IBreadcrumbItem[]> {
    setTimeout(() => {
      this.subItems.next(this.items);
    }, 200);
    return this.subItems.asObservable();
  }

  getSync(): IBreadcrumbItem[] {
    return this.items;
  }

  removeLast() {
    const last = _.last(this.items);
    this.items = this.items.filter(item => item.title !== last.title);
    this.subItems.next(this.items);
  }

}
