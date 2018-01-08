import { Component, Input } from '@angular/core';
import { User } from '../../models';


@Component({
  selector: 'gyetube-user',
  templateUrl: 'user.html'
})
export class UserComponent {

  @Input() user: User;

  constructor() {
  }

  navigateToUserDetail() {

  }
}
