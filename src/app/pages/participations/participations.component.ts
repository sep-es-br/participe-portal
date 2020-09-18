import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MessageService } from 'primeng/api';

import { IParticipation } from 'src/app/shared/interfaces/IParticipation';
import { IQueryOptions } from 'src/app/shared/interfaces/IQueryOptions';
import { StatusParticipationEnum } from 'src/app/shared/enums/StatusParticipationEnum';
import { howLongAgo } from 'src/app/shared/utils/date.utils';
import { ConferenceService } from 'src/app/shared/services/conference.service';
import { ParticipationService } from 'src/app/shared/services/participation.service';

@Component({
  selector: 'app-participations',
  templateUrl: './participations.component.html',
  styleUrls: ['./participations.component.scss'],
  animations:[
    trigger('rotatedState', [
      state('default', style({transform: 'rotateY(90deg)'})),
      state('rotated', style({transform: 'rotateY(0deg)'})),
      transition('rotated => default', animate('500ms ease-out')),
      transition('default => rotated', animate('500ms ease-in'))
    ]),
    trigger('hide',[
      state('default', style({opacity: '0'})),
      state('show', style({opacity: '1'})),
      transition('default => show', animate('500ms ease-in')),
      transition('show => default', animate('500ms ease-out'))
    ]),
    trigger('showMessage', [
      state('default', style({transform: 'scaleX(-1)'})),
      state('show', style({transform: 'scaleX(1)'})),
      transition('default => show', animate('500ms ease-in')),
      transition('show => default', animate('500ms ease-out'))
    ])
  ]
})
export class ParticipationsComponent implements OnInit {

  indexPage: number = 0;
  totalPages: number = 0;
  localityIds: number[] = [];
  planItemIds: number[] = [];
  searchIconClass = 'pi pi-search';
  hide: string = 'default';
  textSearch: string = '';
  state: string = 'default';
  listParticipations: IParticipation[] = [];
  showModalProposal = false;
  selectedParticipation: IParticipation;
  newProposal: string = '';
  classMsg: string;
  searchMessage: string ;
  showMessage: boolean = false;
  wasFound: boolean = false;

  constructor(
    private participationSrv: ParticipationService,
    private conferenceSrv: ConferenceService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.search(true);
  }

  @HostListener('window:scroll', ['$event'])
  async onScroll(event: any) {
    const top = event.srcElement.scrollingElement.scrollTop;
    const offset = event.srcElement.scrollingElement.offsetHeight;
    const max = event.srcElement.scrollingElement.scrollHeight;
    if ((top + offset) >= max) {
      if (this.indexPage <= this.totalPages) {
        this.indexPage = this.indexPage + 1;
        const { success, data } = await this.participationSrv.getAllByConferenceId(this.conferenceSrv.ConferenceActiveId, this.queries);
        if (success) {
          this.totalPages = data.totalPages;
          if (data.participations) {
            data.participations.forEach(proposal => {
              proposal.planItems.forEach(planItem => {
                planItem.fileName = planItem.structureItemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '-')
                  .trim().toLowerCase();
              });
              this.listParticipations.push(proposal);
            });
          }
        }
      }
    }
  }

  async search(skipMsg?: boolean) {
    if (!skipMsg && this.textSearch.length < 3) {
      return this.messageService.add({ severity: 'warn', detail: 'A busca por texto deve ter no mínimo 3 caracteres', life: 15000 });
    }
    this.indexPage = 0;
    try {
      const { data, success } = await this.participationSrv.getAllByConferenceId(this.conferenceSrv.ConferenceActiveId, this.queries);
      if (success) {
        this.listParticipations = data.participations || [];
        this.listParticipations.forEach(({ planItems }) => {
          planItems.forEach(item =>
            item.fileName = item.structureItemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '-').trim().toLowerCase());
        });
        this.totalPages = data.totalPages;
        if (!skipMsg && !!this.textSearch) {
          if (!data.participations || data.participations.length < 1){
            this.searchMessage = 'Hummm... Não estou encontrando esse termo. Que tal tentar um sinônimo ou algo menos específico?';
            this.wasFound = false;
          } else {
            this.searchMessage = 'Oba! Encontrei alguma coisa nos itens abaixo!';
            this.wasFound = true;
          }
          this.showMessage = true;
          this.classMsg = 'animate__animated animate__fadeInRightBig';
        }
      }
    } catch (error) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Erro',
        detail: 'Erro ao tentar buscar as participações, tente novamente'
      })
    }
  }

  async showHide() {
    this.hide = (this.hide === 'default' ? 'show' : 'default');
    this.state = (this.state === 'default' ? 'rotated' : 'default');
    if (this.hide === 'default') {
      this.textSearch = '';
      this.searchIconClass = 'pi pi-search';
      this.search(true);
      this.closeMessage();
    } else {
      this.searchIconClass = 'pi pi-times';
    }
  }

  async saveProposal() {
    if (!this.newProposal) {
      return this.messageService.add({ severity: 'warn', detail: 'Você precisa escrever o comentário que deseja adicionar!', life: 15000 });
    }
    const localityId = Number(this.selectedParticipation.localityDto.id);
    const planItem = this.selectedParticipation.planItems[0].id;
    const { success } = await this.participationSrv.commentAndHighlights(
      localityId, planItem, this.conferenceSrv.ConferenceActiveId, this.newProposal
    );
    if (success) {
      const newParticipation: IParticipation = {
        id: 0,
        classification: 'proposal',
        highlight: false,
        localityDto: this.selectedParticipation.localityDto,
        planItems: this.selectedParticipation.planItems,
        qtdLiked: 0,
        status: StatusParticipationEnum.pen,
        text: this.newProposal,
        time: new Date().toLocaleString('pt-BR')
      };
      this.listParticipations.unshift(newParticipation);
      this.toggleShowModalProposal();
      this.newProposal = '';
      this.selectedParticipation = null;
    } else {
      this.messageService.add({ severity: 'warn', detail: 'Erro ao enviar comentário, tente novamente.', life: 15000 });
    }
  }

  modalOnCallback(event) {
    if (event) {
      this.saveProposal();
    } else {
      this.showModalProposal = false;
    }
  }

  handleNewProposal(participation: IParticipation) {
    this.selectedParticipation = participation;
    this.toggleShowModalProposal();
  }

  toggleShowModalProposal() {
    this.showModalProposal = !this.showModalProposal;
  }

  howLongAgo(strDateAndTime: string) {
    if (strDateAndTime.indexOf('T') !== -1) {
      return howLongAgo(new Date(strDateAndTime));
    }
    const [ strDate, strTime ] = strDateAndTime.split(' ');
    const [ day, month, year ] = strDate.split('/');
    const date = new Date(`${month}-${day}-${year} ${strTime}`);
    return howLongAgo(date);
  }

  getTimeParticipation(participation: IParticipation): string {
    let date = participation.time;
    if (!!participation.moderateTime) {
      const modDate = new Date(participation.moderateTime);
      date = modDate.toLocaleString('pt-BR');
    }
    return date;
  }

  get queries(): IQueryOptions {
    return {
      search: {
        pageNumber: this.indexPage,
        text: this.textSearch
      }
    };
  }

  async closeMessage(){
    this.classMsg = 'animate__animated animate__fadeOutRightBig';
    setTimeout(() => this.showMessage = false, 1000);
  }
}
