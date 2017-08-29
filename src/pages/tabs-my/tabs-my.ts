import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

@IonicPage({
  segment: 'mypage'
})
@Component({
  selector: 'page-tabs-my',
  templateUrl: 'tabs-my.html'
})
export class TabsMyPage {
  tab1Root: string = 'GroupListPage';
  tab2Root: string = 'UncheckedListPage';
  tab3Root: string = 'NotificationListPage';

  loggedIn: boolean = false;

  constructor(
    public navCtrl: NavController,
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
    this.storage.get('currentUserToken').then((val) => {
      if (val)
        this.loggedIn = true;
    });
  }

  pushMenu() {
    this.navCtrl.push('MenuPage');
  }

}
