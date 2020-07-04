import { IHowItWorks } from './../interfaces/IHowItWorks';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HowItWorksService {

  constructor() { }

  public getItems(): IHowItWorks[] {
    return [
      {
        url: '/#', title: 'Login',
        description: 'Faça login com a sua rede social.'
      },
      { url: '/#', title: 'Defina sua microrregião', description: 'Escolha para qual microrregião registrará sua contribuição.' },
      { url: '/#', title: 'Escolha a área estratégica', description: 'Clique na área estratégica para a qual deseja contribuir.' },
      { url: '/#', title: 'Destaque um desafio', description: 'Destaque o desafio que você considera de maior relevância.' },
      {
        url: '/#', title: 'Faça sua proposta',
        description: 'Descreva qual ação o governo deve implementar para superar o desafio destacado. ' +
          'Se preferir, faça uma contribuição livre no final da página.'
      },
      {
        url: '/#', title: 'Participe quantas vezes quiser',
        description: 'Você pode enviar quantas sugestões quiser. Por isso, seja claro, sucinto e específico. ' +
          'Evite registrar várias contribuições diferentes em uma mesma manifestação.'
      },
    ]
  }



}
