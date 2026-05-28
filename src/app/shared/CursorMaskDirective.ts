import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[gambiCursorMask]' // nome da sua diretiva
})
export class CursorMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click')
  onClick() {
    const input = this.el.nativeElement.querySelector('input') || this.el.nativeElement;

    // Testa se o valor tá vazio ou se só tem a máscara limpa
    if (!input.value || input.value.replace(/[^0-9a-zA-Z]/g, '') === '') {
      setTimeout(() => {
        input.setSelectionRange(0, 0);
      }, 0);
    }
  }
}
