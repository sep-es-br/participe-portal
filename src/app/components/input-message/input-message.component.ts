import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-message',
  templateUrl: './input-message.component.html',
  styleUrls: ['./input-message.component.scss']
})
export class InputMessageComponent {

  @Input() form: UntypedFormGroup;
  @Input() field: string;

  constructor(
  ) { }

  isInvalid() {
    try {
      return !this.form.get(this.field).valid && this.form.get(this.field).touched;
    } catch (error) {
      return false;
    }
  }

  message() {
    const errors = this.form.get(this.field).errors;

    if (!errors) {
      return;
    }

    let message = errors.custom && errors.custom.message ? errors.custom.message : 'Informação inválida';

    if (this.form.get(this.field).errors.required) message = 'Campo obrigatório';
    return message;
  }
}
