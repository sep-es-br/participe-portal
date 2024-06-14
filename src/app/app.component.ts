import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from './shared/services/responsive.service';
import { ColorService } from './shared/services/color.service';
import { StoreKeys } from './shared/commons/contants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'portal-participe';
  isMobileView: boolean;
  loading: boolean = false;
  
  constructor(
    private responsiveSrv: ResponsiveService,
    private colorService: ColorService,
  ) {}

  async ngOnInit() {
    try{
      this.loading = true
      if(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE)){
        await this.colorService.setPrimaryColor(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE))
      }
      }catch(error){
        console.error(error)
      }finally{
        this.loading = false
      }
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
