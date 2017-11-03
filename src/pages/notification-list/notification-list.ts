import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  segment: 'notification-list'
})
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html'
})
export class NotificationListPage {

  constructor(
    public navCtrl: NavController
  ) {

  }

  ionViewDidLoad() {
  }
}
