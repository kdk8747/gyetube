import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GroupListPage } from '../group-list/group-list';
import { UncheckedListPage } from '../unchecked-list/unchecked-list';
import { NotificationListPage } from '../notification-list/notification-list';
import { MenuPage } from '../menu/menu';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = GroupListPage;
  tab2Root = UncheckedListPage;
  tab3Root = NotificationListPage;

  constructor(public navCtrl: NavController) {
  }

  pushMenu() {
    this.navCtrl.push(MenuPage);
  }

}
