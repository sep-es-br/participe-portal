import { Injectable } from '@angular/core';
import { IColor } from '../interfaces/IColor';
import { ISvgList } from '../interfaces/ISvgList';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
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
      close2_svg: {htmlText: '', url: 'assets/icons/close2.svg'}
    }

    constructor(
      private sanitizer: DomSanitizer
    ) {
      document.head.appendChild(this.rootStyle)
    }


    setPrimaryColor(color: IColor) {
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

  }
