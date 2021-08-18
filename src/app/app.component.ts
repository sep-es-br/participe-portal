import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from './shared/services/responsive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'portal-participe';
  isMobileView: boolean;

  constructor(
    private responsiveSrv: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.detectViewMode(window.innerWidth);
  }

  detectViewMode(width: number) {
    if (!this.isMobileView && width <= 768) {
      this.responsiveSrv.next(true);
    }
    if (this.isMobileView && width > 768) {
      this.responsiveSrv.next(false);
    }
  }
}
