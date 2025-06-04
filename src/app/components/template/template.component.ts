import {Subscription} from 'rxjs';
import {LoadingService} from '../../shared/services/loading.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';

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
  @Input() customSubtitleFontSize: string;

  isLoading: boolean = false;
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
