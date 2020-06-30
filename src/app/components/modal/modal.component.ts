import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() show: boolean = false;
  @Output() onCallback = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  cancel() {
    this.show = false;
    this.onCallback.next(false);
  }

  confirm() {
    this.onCallback.next(true);
  }

}
