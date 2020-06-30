import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {
  actions: any = [
    { url: '/#', title: 'Login', sub: 'Cadastre-se, faça login no site ou acesse por meio das redes sociais' },
    { url: '/#', title: 'Encontre sua região', sub: 'Escolha a Microrregião que quer participar' },
    { url: '/#', title: 'Selecione um Desafio', sub: 'Entre em uma Área Estratégica e Selecione o Desafio' },
    { url: '/#', title: 'Destaque uma entrega', sub: 'Destaque uma Entrega que você considera de maior relevância' },
    {
      url: '/#', title: 'Detalhe a Entrega Destacada',
      sub: 'Caso queira, faça um detalhamento para está entrega (localização, importância, urgência, etc ...)'
    },
    {
      url: '/#', title: 'Adicione uma contribuição livre',
      sub: 'Caso sua demanda não esteja contemplada pelas entregas do Governo, você pode fazer sua contribuição livremente'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
