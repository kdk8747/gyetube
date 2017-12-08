import { Component, Input } from '@angular/core';
import { DocumentState } from '../../app/constants';


@Component({
  selector: 'grasscube-state-label',
  templateUrl: 'state-label.html'
})
export class StateLabelComponent {
  stateEnum = DocumentState;

  @Input() state: DocumentState;
  @Input() postfix: string;

  constructor() {
  }

}
