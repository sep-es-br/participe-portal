import { ParticipationStateService } from './../../shared/services/participation-state.service';
import { IItem } from './../../shared/interfaces/IItem';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IParticipationPlanItem } from '../../shared/interfaces/IParticipationPlanItem';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ParticipationService } from '../../shared/services/participation.service';
import { ConferenceService } from '../../shared/services/conference.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { INavigation } from '../../shared/interfaces/INavigation';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-conference-steps',
  templateUrl: './conference-steps.component.html',
  styleUrls: ['./conference-steps.component.scss']
})
export class ConferenceStepsComponent implements OnInit, OnDestroy {

  conferenceStepItem: IParticipationPlanItem;
  subParams: Subscription;
  stepId: number;
  localityId: number;
  navigation: INavigation[];
  showModalComment: boolean = false;
  showModalAlternativeProposal: boolean = false;
  alternativeProposal: string;
  itemSelect: IItem;

  hide: string = 'default';
  textSearch: string = '';
  state: string = 'default';
  imageName: string = "search";
  wasFound: boolean = false;
  searchMessage: string ;
  disable: boolean = false;
  showMessage: boolean = false;
  classMsg: string;

  constructor(
    private participationSrv: ParticipationService,
    private conferenceSrv: ConferenceService,
    private breadcrumbSrv: BreadcrumbService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private participationStateSrv: ParticipationStateService,
    private messageService: MessageService
  ) { }

  ngOnDestroy(): void {
    if (this.subParams) {
      this.subParams.unsubscribe();
    }
  }

  ngOnInit() {
    this.populateState();
    this.subParams = this.activeRoute.params.subscribe(({ id }) => {
      this.stepId = +id;
      if (this.stepId) {
        this.loadConferenceStep();
      } else {
        this.route.navigate(['/strategic-area']);
      }
    });
  }

  populateState() {
    const participationState = this.participationStateSrv.getSync();
    this.localityId = _.get(participationState, 'locality.id', 0);
    this.navigation = _.get(participationState, 'navigation', []);
  }

  async loadConferenceStep() {
    const { success, data } = await this.participationSrv.getPlanItem(
      this.conferenceSrv.ConferenceActiveId, this.localityId, this.stepId, ''
    );
    if (success) {
      this.conferenceStepItem = data;
      this.conferenceStepItem.itens.forEach(item => {
        item.checked = (item.votes || item.commentsMade > 0);
      });
      this.breadcrumbSrv.addOrUpdate({ title: data.structureitem.name });
      this.participationStateSrv.removeBeforeNavigation(data.structureitem.name);
    }
  }

  selectNextStep(item: IItem) {
    const hasNext = _.get(this.conferenceStepItem, 'structureitem.hasNext', false);
    if (!hasNext) { return; }
    const { name } = this.conferenceStepItem.structureitem;
    this.participationStateSrv.addNavigation({ label: name, nav: item });
    this.breadcrumbSrv.updateLast({ title: name, subTitle: item.name, route: ['/conference-steps/', this.stepId] });
    this.route.navigate(['/conference-steps', item.id]);
  }

  async checkItem(item: IItem) {
    const { success, data } = await this.participationSrv.commentAndHighlights(this.localityId, item.id, this.conferenceSrv.ConferenceActiveId);
    if(success){
      
      if(item.checked === false && data.votes === true)
        this.messageService.add({ severity: 'success', detail: `Destaque da ${this.conferenceStepItem.structureitem.name} salvo!` });

      else if(item.checked === true && data.votes === false)
        this.messageService.add({ severity: 'success', detail: `Destaque da ${this.conferenceStepItem.structureitem.name} apagado!` });

      item.checked = data.votes;
    }
  }

  comment(item: IItem) {
    this.showModalComment = true;
    this.itemSelect = item;
  }

  async saveComment() {
    if (!this.itemSelect.comment) {
      return this.messageService.add({ severity: 'warn', detail: 'Você precisa escrever o comentário que deseja adicionar!' });
    } else {
      const { success, data } = await this.participationSrv.commentAndHighlights(
        this.localityId, this.itemSelect.id, this.conferenceSrv.ConferenceActiveId, this.itemSelect.comment
      );
      if (success) {
        const indexSelect = this.conferenceStepItem.itens.findIndex(item => item.id === this.itemSelect.id);
        if (indexSelect > -1) {
          this.conferenceStepItem.itens[indexSelect].checked = true;
          this.conferenceStepItem.itens[indexSelect].commentsMade = data.commentsMade;
          this.conferenceStepItem.itens[indexSelect].comments = data.comments;
        }
        this.showModalComment = false;
        this.itemSelect = {} as any;
        this.messageService.add({ severity: 'success', detail: 'Proposta Salva' });
      }
    }
  }

  modalOnCallback(event) {
    if (event) {
      this.saveComment();
    } else {
      this.showModalComment = false;
    }
    this.itemSelect.comment = '';
  }

  openAlternativeProposal() {
    this.showModalAlternativeProposal = true;
    this.alternativeProposal = '';
  }

  async modalAlternativeProposalCallback(event) {
    if (event) {
      if (!this.alternativeProposal) {
        return this.messageService.add({ severity: 'warn', detail: 'Descreva uma proposta alternativa para salvar' });
      }
      await this.participationSrv.alternativeProposal(
        this.localityId,
        this.conferenceStepItem.structureitem.parentLink.idParent,
        this.conferenceSrv.ConferenceActiveId,
        this.alternativeProposal);
      this.showModalAlternativeProposal = false;
      this.messageService.add({ severity: 'success', detail: 'Proposta Salva' });
    } else {
      this.showModalAlternativeProposal = false;
    }
  }


  backNavitation() {
    this.populateState();
    if (this.navigation.length >= 2) {
      const lastStep2 = this.navigation[this.navigation.length - 2];
      this.participationStateSrv.removeLast();
      this.route.navigate(['/conference-steps', lastStep2.nav.id]);
    } else {
      this.route.navigate(['/strategic-area']);
    }
  }

  async showHide() {
    this.disable = true;
    await this.delay(10);
    this.hide = (this.hide === 'default' ? 'show' : 'default');
    this.state = (this.state === 'default' ? 'rotated' : 'default');
    if(this.hide === 'default'){
      await this.delay(600);
      this.imageName = "search"
      this.disable =  false;
    }
    else{
      this.imageName = "close"
    }
    
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  async search(){
    const { success, data } = await this.participationSrv.getPlanItem(this.conferenceSrv.ConferenceActiveId, this.localityId, this.stepId, this.textSearch);
    if(success){
      if(!data.itens || data.itens.length < 1){
        this.searchMessage = "Hummm... Não estou encontrando esse termo. Que tal tentar um sinônimo ou algo menos específico?"
        this.wasFound = false;
        this.renderList([]);
      }
      else{
        this.searchMessage = "Oba! Encontrei alguma coisa nos itens abaixo!"
        this.wasFound = true;
        this.renderList(data.itens);
      }
      this.showMessage = true;
      this.classMsg = "animate__animated animate__fadeInRightBig"
    }
  }

  renderList(data: IItem[]){
    this.conferenceStepItem.itens = data;
  }

  async closeMessage(){
    this.classMsg = "animate__animated animate__fadeOutRightBig"
    await this.delay(1000);
    this.showMessage = false;
  }

}
