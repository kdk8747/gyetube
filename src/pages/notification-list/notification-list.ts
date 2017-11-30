import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService } from '../../providers';

@IonicPage({
  segment: 'notification-list'
})
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html'
})
export class NotificationListPage {

  constructor(
    public navCtrl: NavController,
    public event: Events,
    public util: UtilService,
  ) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
