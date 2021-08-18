import {ParticipationStateService} from '../../shared/services/participation-state.service';
import {IItem} from '../../shared/interfaces/IItem';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {IParticipationPlanItem} from '../../shared/interfaces/IParticipationPlanItem';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ParticipationService} from '../../shared/services/participation.service';
import {ConferenceService} from '../../shared/services/conference.service';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {INavigation} from '../../shared/interfaces/INavigation';
import * as _ from 'lodash';
import {MessageService} from 'primeng/api';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-conference-steps',
  templateUrl: './conference-steps.component.html',
  styleUrls: ['./conference-steps.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('default', style({transform: 'rotateY(90deg)'})),
      state('rotated', style({transform: 'rotateY(0deg)'})),
      transition('rotated => default', animate('500ms ease-out')),
      transition('default => rotated', animate('500ms ease-in'))
    ]),
    trigger('hide', [
      state('default', style({opacity: '0'})),
      state('show', style({opacity: '1'})),
      transition('default => show', animate('500ms ease-in')),
      transition('show => default', animate('500ms ease-out'))
    ]),
    trigger('showMessage', [
      state('default', style({transform: 'translate(450px,0)'})),
      state('show', style({transform: 'translate(-450px,0)'})),
      transition('default => show', animate('500ms ease-in')),
      transition('show => default', animate('500ms ease-out'))
    ])
  ]
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
  imageName: string = 'search';
  wasFound: boolean = false;
  searchMessage: string;
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
  ) {
  }

  ngOnDestroy(): void {
    if (this.subParams) {
      this.subParams.unsubscribe();
    }
  }

  async ngOnInit() {
    this.populateState();
    this.subParams = await this.activeRoute.queryParams.subscribe(async ({id}) => {
      this.stepId = +id;
      await this.loadConferenceStep();
    });
    window.scrollTo(0, 0);
  }

  populateState() {
    const participationState = this.participationStateSrv.getSync();
    this.localityId = _.get(participationState, 'locality.id');
    this.navigation = _.get(participationState, 'navigation', []);
  }

  async loadConferenceStep() {
    const {success, data} = await this.participationSrv.getPlanItem(
      this.conferenceSrv.ConferenceActiveId, this.localityId, this.stepId ? this.stepId : null, ''
    );
    if (success) {
      this.conferenceStepItem = data;
      this.conferenceStepItem.itens.forEach(item => {
        item.checked = (item.votes || item.commentsMade > 0);
      });
      this.breadcrumbSrv.addOrUpdate({title: data.structureitem.name});
      this.participationStateSrv.removeBeforeNavigation(data.structureitem.name);
    }
  }

  async selectNextStep(item: IItem) {
    const hasNext = _.get(this.conferenceStepItem, 'structureitem.hasNext', false);
    if (!hasNext) {
      return;
    }
    const {name} = this.conferenceStepItem.structureitem;
    this.participationStateSrv.addNavigation({label: name, nav: item});
    this.breadcrumbSrv
    .updateLast({title: name, subTitle: item.name, route: ['/conference-steps'], queryParams: {id: this.stepId } });

    await this.route.navigate(['/conference-steps'], {queryParams: {id: item.id} });
  }

  async checkItem(item: IItem) {
    const {success, data} = await this.participationSrv
      .commentAndHighlights(this.localityId ? this.localityId : null, item.id, this.conferenceSrv.ConferenceActiveId);
    if (success) {

      if (item.checked === false && data.votes === true) {
        this.messageService.add({
          severity: 'success',
          detail: `Destaque da ${this.conferenceStepItem.structureitem.name} salvo!`, life: 15000
        });
      } else if (item.checked === true && data.votes === false) {
        this.messageService.add({
          severity: 'success',
          detail: `Destaque da ${this.conferenceStepItem.structureitem.name} apagado!`, life: 15000
        });
      }

      item.checked = data.votes;
    }
  }

  comment(item: IItem) {
    this.showModalComment = true;
    this.itemSelect = item;
  }

  async saveComment() {
    if (!this.itemSelect.comment.trim()) {
      return this.messageService.add({severity: 'warn', detail: 'Você precisa escrever o comentário que deseja adicionar!', life: 15000});
    } else {
      const {success, data} = await this.participationSrv.commentAndHighlights(
        this.localityId ? this.localityId : null, this.itemSelect.id, this.conferenceSrv.ConferenceActiveId, this.itemSelect.comment.trim()
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
        this.messageService.add({severity: 'success', detail: 'Proposta Salva', life: 15000});
      }
    }
  }

  async modalOnCallback(event) {
    if (event) {
      await this.saveComment();
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
        return this.messageService.add({severity: 'warn', detail: 'Descreva uma proposta alternativa para salvar', life: 15000});
      }
      await this.participationSrv.alternativeProposal(
        this.localityId,
        this.conferenceStepItem.structureitem.parentLink.idParent,
        this.conferenceSrv.ConferenceActiveId,
        this.alternativeProposal);
      this.showModalAlternativeProposal = false;
      this.messageService.add({severity: 'success', detail: 'Proposta Salva', life: 15000});
    } else {
      this.showModalAlternativeProposal = false;
    }
  }


  async backNavigation() {
    this.populateState();
    console.log(this.navigation.length);
    if (this.navigation.length >= 2) {
      const lastStep2 = this.navigation[this.navigation.length - 2];
      this.participationStateSrv.removeLast();
      return await this.route.navigate(['/conference-steps'], {queryParams: {id: lastStep2.nav.id} });
    }
    if (this.navigation.length === 1) {
      this.participationStateSrv.clear();
      return await this.route.navigate(['/conference-steps']);
    }
    if (this.navigation.length === 0) {
      return await this.route.navigate(['/conference-map']);
    }
  }

  async showHide() {
    this.textSearch = '';
    this.disable = true;
    await this.delay(10);
    this.hide = (this.hide === 'default' ? 'show' : 'default');
    this.state = (this.state === 'default' ? 'rotated' : 'default');
    if (this.hide === 'default') {
      await this.delay(600);
      this.imageName = 'search';
      this.disable = false;
    } else {
      this.imageName = 'close';
    }

  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  async search() {
    const {success, data} = await this.participationSrv
      .getPlanItem(this.conferenceSrv.ConferenceActiveId, this.localityId, this.stepId, this.textSearch);
    if (success) {
      if (!data.itens || data.itens.length < 1) {
        this.searchMessage = 'Hummm... Não estou encontrando esse termo. Que tal tentar um sinônimo ou algo menos específico?';
        this.wasFound = false;
        this.renderList([]);
      } else {
        this.searchMessage = 'Oba! Encontrei alguma coisa nos itens abaixo!';
        this.wasFound = true;
        this.renderList(data.itens);
      }
      this.showMessage = true;
      this.classMsg = 'animate__animated animate__fadeInRightBig';
    }
  }

  renderList(data: IItem[]) {
    this.conferenceStepItem.itens = data;
  }

  async closeMessage() {
    this.classMsg = 'animate__animated animate__fadeOutRightBig';
    await this.delay(1000);
    this.showMessage = false;
  }

}
