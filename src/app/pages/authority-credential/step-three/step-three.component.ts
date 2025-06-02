import {Component, ElementRef, Input, OnInit, signal, ViewChild} from '@angular/core';
import {IPreRegistration} from "../../../shared/interfaces/IPreRegistration";
import html2canvas from "html2canvas";
import {IPerson} from "../../../shared/interfaces/IPerson";
import {LoadingService} from "../../../shared/services/loading.service";
import { IPreRegistrationAuthority } from 'src/app/shared/interfaces/IPreRegistrationAuthority';

@Component({
  selector: 'app-authc-step-three',
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent implements OnInit {
  @Input() preRegistration = signal<IPreRegistrationAuthority>({} as IPreRegistrationAuthority);

  @Input()  userInfo = signal<IPerson>({} as IPerson);

  @ViewChild('confirmationCard', { static: false }) content: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  public link : string;

  constructor(
    private loadingService: LoadingService,
  ) {
  }

  ngOnInit(): void {
      this.link = window.location.href;
  }

  protectExibitionEmail(email?:string){
    if(!email){
      return '*****';
    }
    const emailSplit = email.split('@');
    const emailProtected = emailSplit[0].slice(0,2) + '*****@' + emailSplit[1];
    return emailProtected;
  }


  treatNameExibition(name:string){
    return name.trim().toLowerCase().replace(/ /g, '_');
  }

  print(){
    window.print();
  }

  saveImage() {
    this.loadingService.loading(true);
    const buttons = this.content.nativeElement.querySelectorAll('.action-buttons');
    buttons.forEach(button => {
      button.classList.add('hide-buttons');
    });
    const width = this.content.nativeElement.offsetWidth;
    const height = this.content.nativeElement.offsetHeight;
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;

    if(window.innerWidth < 768 ){
      canvas.width =  850;
      canvas.height = 1780;
    }else{
      canvas.width =  width;
      canvas.height = height;
    }

    html2canvas(this.content.nativeElement,{ canvas }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'confirmacao_inscricao_'+ this.treatNameExibition(this.preRegistration().meeting.name)+ '_' +this.treatNameExibition(this.userInfo().name)+'.png';
      link.click();
      console.log(canvas);
    });

    buttons.forEach(button => {
      button.classList.remove('hide-buttons');
    });

    setTimeout(() => {
      this.loadingService.loading(false);
    }, 1000);
  }
}
