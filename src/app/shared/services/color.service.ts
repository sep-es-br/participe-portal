import { Inject, Injectable, Injector } from '@angular/core';
import { IColor } from '../interfaces/IColor';
import { ISvgList } from '../interfaces/ISvgList';
import { DomSanitizer } from '@angular/platform-browser';
import { IResultHttp } from '../interfaces/IResultHttp';
import { IResultPerson } from '../interfaces/IResultPerson';
import { BaseService } from './base.service';
import { StoreKeys } from '../commons/contants';

@Injectable({
  providedIn: 'root'
})
export class ColorService extends BaseService<any> {
    private rootStyle: HTMLStyleElement = document.createElement("style")
    color: IColor = {
      background: 'rgba(21,57,97,1)',
      accentColor: '#00a198',
      fontColor: 'white',
      cardFontColor: 'black',
      cardFontColorHover: 'white',
      cardColor: 'white',
      cardColorHover: '#00a198',
      cardBorderColor: 'white',
      borderColor: 'white'
    };

    svgList: ISvgList = {
      home_svg: {htmlText: '', url: 'assets/icons/home.svg'},
      arrow_right_svg: {htmlText: '', url: 'assets/icons/arrow-right.svg'},
      external_link_alt_solid_svg: {htmlText: '', url: 'assets/icons/external-link-alt-solid.svg'},
      user2_svg: {htmlText: '', url: 'assets/icons/user2.svg'},
      close2_svg: {htmlText: '', url: 'assets/icons/close2.svg'},
      arrow_left_circle_svg: {htmlText: '', url: 'assets/icons/arrow-left-circle.svg'},
      search_svg: {htmlText: '', url: 'assets/icons/search.svg'},
      check_circle_svg: {htmlText: '', url: 'assets/icons/check-circle.svg'},
      comment2_svg: {htmlText: '', url: 'assets/icons/comment2.svg'},
      comment2_white_svg: {htmlText: '', url: 'assets/icons/comment2 white.svg'},
      help_circle_svg: {htmlText: '', url: 'assets/icons/help-circle.svg'},
      locality_without_map_gradient_svg: {htmlText: '', url: 'assets/icons/locality-without-map-gradient.svg'},
      area_tematica_gradient_svg: {htmlText: '', url: 'assets/icons/area-tematica-gradient.svg'},
      desafio_svg: {htmlText: '', url: 'assets/icons/desafio.svg'},
      quote2_svg: {htmlText: '', url: 'assets/icons/quote2.svg'},
      like2_svg: {htmlText: '', url: 'assets/icons/like2.svg'},
      check_circle2_svg: {htmlText: '', url: 'assets/icons/check-circle2.svg'},
      logomark_white2_svg: {htmlText: '', url: 'assets/icons/logomark-white2.svg'},
      
    }

    constructor(
      private sanitizer: DomSanitizer,
      @Inject(Injector) injector: Injector,
    ) {
      super('color', injector);
      document.head.appendChild(this.rootStyle)
    }

    getConferenceColor(idConference: number): Promise<IResultHttp<IColor>> {
      return this.http.get<IResultHttp<IColor>>(`${this.urlBase}/${idConference}`).toPromise();
    }


    async setPrimaryColor(color: IColor) {

      const result = await this.getConferenceColor(parseInt(localStorage.getItem(StoreKeys.CONFERENCE_ACTIVE)))

      if(!(Object.entries(result.data).length == 0)){
        this.rootStyle.textContent = 
        `
        :root {
          --background: ${color.background};
          --accent-color: ${color.accentColor};
          --font-color: ${color.fontColor};
          --card-font-color: ${color.cardFontColor};
          --card-font-color-hover: ${color.cardFontColorHover};
          --card-color: ${color.cardColor};
          --card-color-hover: ${color.cardColorHover};
          --card-border-color: ${color.cardBorderColor};
          --border-color: ${color.borderColor};
        }
        `
      }
      }

    async getSVG() {
      for (const key in this.svgList) {
        const svgItem = this.svgList[key]
        let svgText;
        try {
          const response = await fetch(svgItem.url)
          svgText = await response.text()
        } catch {
          console.error('Erro ao buscar o arquivo SVG: ' + `${svgItem.url}`)
        } finally {
          svgItem.htmlText = this.sanitizer.bypassSecurityTrustHtml(svgText)
          console.log(svgItem)
        }
      }
    }

    getCssVariableValue(variableName: string): string {
      const root = document.documentElement;
      const value = getComputedStyle(root).getPropertyValue(variableName);
      return value.trim();
    }

  }
