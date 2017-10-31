import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService } from '../../../providers';
import { User } from '../../../models';

@IonicPage({
  segment: 'list'
})
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html'
})
export class NotificationListPage {

  loggedIn: boolean = false;
  user: User;

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public util: UtilService
  ) {

  }

  ionViewDidLoad() {
    this.util.getCurrentUser()
      .then((user: User) => {
        this.loggedIn = true;
        this.user = user;
      }).catch((error: any) => {
        console.log(error);
      });
  }

  pushMenu() {
    this.event.publish('EventMenuPage');
  }
}
