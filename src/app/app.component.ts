import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from './shared/services/responsive.service';
import { ColorService } from './shared/services/color.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'portal-participe';
  isMobileView: boolean;

  constructor(
    private responsiveSrv: ResponsiveService,
    private colorService: ColorService,
  ) {
  }

  ngOnInit(): void {
    this.colorService.setPrimaryColor()
    this.colorService.getSVG()
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
