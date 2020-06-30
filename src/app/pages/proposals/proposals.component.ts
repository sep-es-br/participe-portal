import { Component, OnInit, HostListener  } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { ProposalService } from 'src/app/shared/services/proposal.service';
import { ISelectItem } from 'src/app/shared/interfaces/ISelectItem';
import { IProposal } from 'src/app/shared/interfaces/IProposal';
import { IProposals } from 'src/app/shared/interfaces/IProposals';
import { ConferenceService } from 'src/app/shared/services/conference.service';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss'],
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
      state('default', style({transform: 'translate(450px,0)'})),
      state('show', style({transform: "translate(-450px,0)"})),
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
  

  hide: string = 'default';
  textSearch: string = '';
  state: string = 'default';
  imageName: string = "search";
  classMsg: string;
  searchMessage: string ;
  regionName: string;
  itemName: string;

  disable: boolean = false;
  showMessage: boolean = false;
  wasFound: boolean = false;
  checkRegion: boolean = false;
  checkLocality: boolean = false;
  localityDropdow: ISelectItem[];
  planItemDropdow: ISelectItem[];

  listProposals: IProposal[];

  constructor(
    private proposalSrv: ProposalService,
    private conferenceSrv: ConferenceService,
  ) { }

  async ngOnInit() {
    await this.loadInformationFilters();
    await this.loadProposals(this.indexPage);
  }

  @HostListener("window:scroll", ["$event"])
  async onScroll(event: any) {
    const top = event.srcElement.scrollingElement.scrollTop;
    const offset = event.srcElement.scrollingElement.offsetHeight;
    const max = event.srcElement.scrollingElement.scrollHeight;
    if (top+offset >= max) {
      
      if(this.indexPage <= this.totalPages){
        this.indexPage = this.indexPage + 1;
        const { success, data } = await this.proposalSrv.getPoposals(this.conferenceSrv.ConferenceActiveId,this.indexPage,this.textSearch,this.localityIds,this.planItemIds, );
        if(success){
          this.totalPages = data.totalPages;
          if(data.proposals){
            data.proposals.forEach(proposal =>{
              proposal.planItens.forEach(planItem =>{
                planItem.fileName = planItem.structureItemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '-').trim().toLowerCase();
              })
              this.listProposals.push(proposal);
            });
          }
        }
      }
    }
  }

  async loadInformationFilters(){
    this.localityDropdow = [];
    this.planItemDropdow = [];

    const { success, data } = await this.proposalSrv.getFilters(this.conferenceSrv.ConferenceActiveId);
    
    if(success){
      this.regionName = data.regionName;
      this.itemName = data.itemName;
      data.itens.forEach(item => {
        const planitem: ISelectItem = {
          value: item.id,
          label: item.name
        }
        this.planItemDropdow.push(planitem)
      });

      data.localities.forEach(locality => {
        const local: ISelectItem = {
          value: locality.id,
          label: locality.name
        }
        this.localityDropdow.push(local);
      })
    }

  }

  async loadProposals(indexPage: number){
    
    const { success, data } = await this.proposalSrv.getPoposals(this.conferenceSrv.ConferenceActiveId,indexPage,this.textSearch,this.localityIds,this.planItemIds);

    if(success){
      this.totalPages = data.totalPages;
      this.listProposals = []
      this.listProposals = data.proposals;
      this.listProposals.forEach(proposal => {
        proposal.planItens.forEach(planItem =>{
          planItem.fileName = planItem.structureItemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '-').trim().toLowerCase();
        })
      });
    }
  }

  async likeProposal(index:string, item:IProposal){
    const { success, data } = await this.proposalSrv.makeLike(item.commentid);
    
    if(success){
      item.likes = data;
      let likeElement = document.getElementById(index);
      if(likeElement.className.includes("likes likesAfter"))
        likeElement.className = 'likes likesBefore';
      else
        likeElement.className = 'likes likesAfter';
    }
    else{
      console.error(success, data);
    }
  }

  async LocalitiesSelected(item:ISelectItem){

    const index = this.localityIds.findIndex(id => id === item.value); 
    if(index > -1){
      this.localityIds.splice(index,1);
    }
    else{
      this.localityIds.push(item.value);
    }

    this.indexPage = 0;
    const { success, data } = await this.proposalSrv.getPoposals(this.conferenceSrv.ConferenceActiveId,this.indexPage,this.textSearch,this.localityIds,this.planItemIds, );
    if(success){
      this.totalPages = data.totalPages;
      this.renderList(data.proposals ? data.proposals : [])    
    }
  }

  async planItemSelect(item:ISelectItem){
    const index = this.planItemIds.findIndex(id => id === item.value); 
    if(index > -1){
      this.planItemIds.splice(index,1);
    }
    else{
      this.planItemIds.push(item.value);
    }

    this.indexPage = 0;
    const { success, data } = await this.proposalSrv.getPoposals(this.conferenceSrv.ConferenceActiveId,this.indexPage,this.textSearch,this.localityIds,this.planItemIds, );
    if(success){
      this.totalPages = data.totalPages;
      this.renderList(data.proposals ? data.proposals : [])
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
    this.indexPage = 0;
    const { success, data } = await this.proposalSrv.getPoposals(this.conferenceSrv.ConferenceActiveId,this.indexPage,this.textSearch,this.localityIds,this.planItemIds, );
    if(success){
      this.totalPages = data.totalPages;
      
      if(!data.proposals || data.proposals.length < 1){
        this.searchMessage = "Hummm... Não estou encontrando esse termo. Que tal tentar um sinônimo ou algo menos específico?"
        this.wasFound = false;
        this.renderList([]);
      }
      else{
        this.searchMessage = "Oba! Encontrei alguma coisa nos itens abaixo!"
        this.wasFound = true;
        this.renderList(data.proposals);
      }
      this.showMessage = true;
      this.classMsg = "animate__animated animate__fadeInRightBig"
      
    }
  }

  renderList(data: IProposal[]){
    this.listProposals = data;
    this.listProposals.forEach(proposal => {
      proposal.planItens.forEach(planItem =>{
        planItem.fileName = planItem.structureItemName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '-').trim().toLowerCase();
      })
    });
  }

  async closeMessage(){
    this.classMsg = "animate__animated animate__fadeOutRightBig"
    await this.delay(1000);
    this.showMessage = false;
  }

  closeSubMenu(subMenu: string){
    
    if(subMenu.includes("region"))
      this.checkRegion = false;
    
    if(subMenu.includes("locality"))
      this.checkLocality = false;
  }
}