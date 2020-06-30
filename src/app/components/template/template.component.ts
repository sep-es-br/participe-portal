import { Subscription } from 'rxjs';
import { LoadingService } from './../../shared/services/loading.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {


  @Input() useCard: boolean;
  @Input() fullLayout: boolean;
  @Input() footerVisible: boolean;
  @Input() disablebreadcrumb: boolean = false;

  @Input() title: string;
  @Input() subTitle: string;

  isLoading: boolean = true;
  loadingSub: Subscription;

  constructor(
    private loadingSrv: LoadingService
  ) { }

  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.loadingSub = this.loadingSrv.isLoading().subscribe(loading =>
      setTimeout(() => {
        this.isLoading = loading;
      }, 100)
    );
  }

}
