import { Component, OnInit } from '@angular/core';
import { IHowItWorks } from '../../shared/interfaces/IHowItWorks';
import { HowItWorksService } from '../../shared/services/howitworks.service';

@Component({
  selector: 'app-how-it-works-slim',
  templateUrl: './how-it-works-slim.component.html',
  styleUrls: ['./how-it-works-slim.component.scss']
})
export class HowItWorksSlimComponent implements OnInit {

  items: IHowItWorks[] = [];

  constructor(
    private howItWorkSrv: HowItWorksService
  ) { }

  ngOnInit() {
    this.items = this.howItWorkSrv.getItems();
  }

}
