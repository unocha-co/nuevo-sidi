import { Component, Input } from '@angular/core';

@Component({
  selector: 'error-message',
  templateUrl: 'validation-error.html'
})
export class ValidationError {

  @Input() message;

  constructor() {
    
  }

}
