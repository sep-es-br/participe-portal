import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from './../../shared/services/breadcrumb.service';

export interface IBreadcrumbItem {
  title: string;
  subTitle?: string;
  route?: any;
}
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  sub: Subscription;
  items: IBreadcrumbItem[] = [];
  event = new EventEmitter();

  constructor(
    private breadcrumbSrv: BreadcrumbService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    this.sub = this.breadcrumbSrv.get().subscribe(items => {
      this.items = items;
    });
  }

  navigate(route) {
    this.router.navigate(route);
  }

}
