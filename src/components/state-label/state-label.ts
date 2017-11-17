import { Component, Input } from '@angular/core';
import { State } from '../../app/constants';


@Component({
  selector: 'grasscube-state-label',
  templateUrl: 'state-label.html'
})
export class StateLabelComponent {
  stateEnum = State;

  @Input() state: State;

  constructor() {
  }

}
