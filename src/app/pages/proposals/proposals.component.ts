import { Component, OnInit, HostListener } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { ProposalService } from 'src/app/shared/services/proposal.service';
import { ISelectCheckItem } from 'src/app/shared/interfaces/ISelectCheckItem';
import { IProposal } from 'src/app/shared/interfaces/IProposal';
import { ConferenceService } from 'src/app/shared/services/conference.service';
import { howLongAgo } from 'src/app/shared/utils/date.utils';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ColorService } from 'src/app/shared/services/color.service';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss'],
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

export class ProposalsComponent implements OnInit {

  indexPage: number = 0;
  totalPages: number = 0;
  localityIds: number[] = [];
  planItemIds: number[] = [];
  regionalization: boolean;


  hide: string = 'default';
  textSearch: string = '';
  state: string = 'default';
  imageName: string = 'search_svg';
  classMsg: string;
  searchMessage: string ;
  regionName: string;
  itemName: string;

  disable: boolean = false;
  showMessage: boolean = false;
  wasFound: boolean = false;
  checkRegion: boolean = false;
  checkLocality: boolean = false;

  localityDropdow: ISelectCheckItem[];
  selectAllLocalities: boolean;

  planItemDropdow: ISelectCheckItem[];
  selectAllPlanItems: boolean;

  listProposals: IProposal[];

  userId: number;

  constructor(
    private proposalSrv: ProposalService,
    private conferenceSrv: ConferenceService,
    private authSrv: AuthService,
    public colorService: ColorService
  ) { }

  async ngOnInit() {
    await this.loadRegionalizationConference();
    await this.loadInformationFilters();
    await this.loadProposals(this.indexPage);
  }

  @HostListener('window:scroll', ['$event'])
  async onScroll(event: any) {
    const top = event.target.scrollingElement.scrollTop;
    const offset = event.target.scrollingElement.offsetHeight;
    const max = event.target.scrollingElement.scrollHeight;
    if (top + offset >= max) {

      if (this.indexPage <= this.totalPages) {
        this.indexPage = this.indexPage + 1;
        const { success, data } = await this.proposalSrv
          .getPoposals(this.conferenceSrv.ConferenceActiveId, this.indexPage, this.textSearch, this.localityIds, this.planItemIds);
        if (success) {
          this.totalPages = data.totalPages;
          if (data.proposals) {
            data.proposals.forEach(proposal => {
              proposal.planItens.forEach((planItem, index) => {
                planItem.fileName = index == 0 ? "area_tematica" : "desafio"
              });
              this.listProposals.push(proposal);
            });
          }
        }
      }
    }
  }

  async loadInformationFilters() {
    this.localityDropdow = [];
    this.planItemDropdow = [];

    const { success, data } = await this.proposalSrv.getFilters(this.conferenceSrv.ConferenceActiveId);

    if (success) {
      if (this.regionalization) {
        this.regionName = data.regionName;
        this.localityDropdow = await data.localities.map(locality => {
          return {check: true, value: locality.id, label: locality.name};
        });
        this.localityIds = await data.localities.map(locality => locality.id);
        this.localityDropdow.sort((a, b) => (a.label.toUpperCase().localeCompare(b.label.toUpperCase(), 'pt')));
        this.selectAllLocalities = true;
      }
      this.itemName = data.itemName;

      this.planItemDropdow = await data.itens.map(item => {
        return {check: true, value: item.id, label: item.name};
      });
      this.planItemIds = await data.itens.map(item => item.id);
      this.planItemDropdow.sort((a, b) => (a.label.toUpperCase().localeCompare(b.label.toUpperCase(), 'pt')));
      this.selectAllPlanItems = true;
    }
  }

  async toggleAllItems() {
    this.planItemDropdow.forEach(dropItem => {
      dropItem.check = this.selectAllPlanItems;
    });
    this.planItemIds = this.planItemDropdow.map(item => {
      if (item.check) {
        return item.value;
      }
    });
    this.loadProposals(0);
  }

  async toggleAllLocalities() {
    this.localityDropdow.forEach(dropLocality => {
      dropLocality.check = this.selectAllLocalities;
    });
    this.localityIds = this.localityDropdow.map(locality => {
      if (locality.check) {
        return locality.value;
      }
    });
    this.loadProposals(0);
  }

  async loadProposals(indexPage: number) {

    const { success, data } = await this.proposalSrv
    .getPoposals(this.conferenceSrv.ConferenceActiveId, indexPage, this.textSearch, this.localityIds, this.planItemIds);

    if (success) {
      this.totalPages = data.totalPages;
      this.listProposals = [];
      this.listProposals = data.proposals ? data.proposals : [];
      this.listProposals.forEach(proposal => {
        proposal.planItens.forEach((planItem, index) => {
          planItem.fileName = index == 0 ? "area_tematica" : "desafio"
        });
      });
    }
  }

  async loadRegionalizationConference() {
    if (this.conferenceSrv.ConferenceActiveId) {
      const { data } = await this.conferenceSrv.getRegionalization(this.conferenceSrv.ConferenceActiveId);
      this.regionalization = data.regionalization;
    }
  }

  isMyComment(item: IProposal): boolean {
    return (item.personId === this.authSrv.getUserInfo.id);
  }

  async likeProposal(index: number, item: IProposal) {
    const { success, data } = await this.proposalSrv.makeLike(item.commentid);
    if (success) {
      item.likes = Number(data);
      const likeElement = document.getElementById(""+index);
      if (likeElement.className.includes('ikes likesAfter')) {
        likeElement.className = 'likes likesBefore';
      } else {
        likeElement.className = 'likes likesAfter';
      }
    } else {
      console.error(success, data);
    }
  }

  async LocalitiesSelected(item: ISelectCheckItem) {
    this.localityIds =
    this.localityDropdow
      .map(dropLocality => {
        if (dropLocality.check) {
          return dropLocality.value;
        }
      });

    const selectedCount = this.localityDropdow.filter(option => option.check).length;
    if (selectedCount === this.localityDropdow.length) {
      this.selectAllLocalities = true;
    }
    if (selectedCount === 0) {
      this.selectAllLocalities = false;
    }

    this.indexPage = 0;
    const { success, data } = await this.proposalSrv
    .getPoposals(this.conferenceSrv.ConferenceActiveId, this.indexPage, this.textSearch, this.localityIds, this.planItemIds);
    if (success) {
      this.totalPages = data.totalPages;
      this.renderList(data.proposals ? data.proposals : []);
    }
  }

  partiallySelected(dropDown: ISelectCheckItem[]): boolean {
    const selectedCount = dropDown.filter(option => option.check).length;
    return ((selectedCount !== dropDown.length) && (selectedCount !== 0));
  }

  async planItemSelect(item: ISelectCheckItem) {

    this.planItemIds =
      this.planItemDropdow
        .map(dropItem => {
          if (dropItem.check) {
            return dropItem.value;
          }
        })
        .filter(id => (id !== undefined));

    const selectedCount = this.planItemDropdow.filter(option => option.check).length;
    if (selectedCount === this.planItemDropdow.length) {
      this.selectAllPlanItems = true;
    }
    if (selectedCount === 0) {
      this.selectAllPlanItems = false;
    }

    this.indexPage = 0;
    const { success, data } = await this.proposalSrv
    .getPoposals(this.conferenceSrv.ConferenceActiveId, this.indexPage, this.textSearch, this.localityIds, this.planItemIds );
    if (success) {
      this.totalPages = data.totalPages;
      this.renderList(data.proposals ? data.proposals : []);
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
      this.imageName = 'search_svg';
      this.disable =  false;
    } else {
      this.imageName = 'close_svg';
    }

  }

  getSvgHtml(imageName: string): string {
    const teste = this.colorService.svgList.imageName.htmlText
    console.log(teste)
    return "this.colorService.svgList[imageName].htmlText"
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  async search() {
    this.indexPage = 0;
    const { success, data } = await this.proposalSrv
    .getPoposals(this.conferenceSrv.ConferenceActiveId, this.indexPage, this.textSearch, this.localityIds, this.planItemIds, );
    if (success) {
      this.totalPages = data.totalPages;

      if (!data.proposals || data.proposals.length < 1) {
        this.searchMessage = 'Hummm... Não estou encontrando esse termo. Que tal tentar um sinônimo ou algo menos específico?';
        this.wasFound = false;
        this.renderList([]);
      } else {
        this.searchMessage = 'Oba! Encontrei alguma coisa nos itens abaixo!';
        this.wasFound = true;
        this.renderList(data.proposals);
      }
      this.showMessage = true;
      this.classMsg = 'animate__animated animate__fadeInRightBig';

    }
  }

  renderList(data: IProposal[]) {
    this.listProposals = data;
    this.listProposals.forEach(proposal => {
        proposal.planItens.forEach((planItem, index) => {
          planItem.fileName = index == 0 ? "area_tematica" : "desafio"
      });
    });
  }

  async closeMessage() {
    this.classMsg = 'animate__animated animate__fadeOutRightBig';
    await this.delay(1000);
    this.showMessage = false;
  }

  closeSubMenu(subMenu: string) {

   if (subMenu.includes('region')) {
     this.checkRegion = false;
   }

   if (subMenu.includes('locality')) {
     this.checkLocality = false;
   }
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
}
