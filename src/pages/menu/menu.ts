import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  segment: 'menu',
  defaultHistory: ['TabsMyPage']
})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  constructor(
    public navCtrl: NavController
  ) {

  }

  popMenu() {
    this.navCtrl.pop();
  }

  pushLogin() {
    this.navCtrl.pop();
    this.navCtrl.push('LoginPage');
  }
}
