import { Component, Input } from '@angular/core';
import { User } from '../../models';


@Component({
  selector: 'grasscube-user',
  templateUrl: 'user.html'
})
export class UserComponent {

  @Input() user: User;

  constructor() {
  }

  navigateToUserDetail() {

  }
}
