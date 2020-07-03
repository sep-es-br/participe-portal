import { IHowItWorks } from './../../shared/interfaces/IHowItWorks';
import { HowItWorksService } from './../../shared/services/howitworks.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {

  items: IHowItWorks[] = [];

  constructor(
    private howItWorkSrv: HowItWorksService
  ) { }

  ngOnInit() {
    this.items = this.howItWorkSrv.getItems();
  }

}
