import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';

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
    this.navCtrl.push(LoginPage);
  }
}
