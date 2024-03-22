import { AfterViewChecked, Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { ColorService } from 'src/app/shared/services/color.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface IBreadcrumbItem {
  title: string;
  subTitle?: string;
  route?: any;
  queryParams?: any;
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
    private router: Router,
    private colorService: ColorService,
  ) { 
    
  }
  
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  
  async ngOnInit() {
    this.sub = this.breadcrumbSrv.get().subscribe(items => {
      this.items = items;
    });
  }

  async navigate(route, queryParams?) {
    if (queryParams && !isNaN(queryParams)) {
      await this.router.navigate(route, {queryParams});
    } else {
      await this.router.navigate(route);
    }
  }


}
