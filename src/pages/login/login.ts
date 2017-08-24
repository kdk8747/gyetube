import { Component, Inject } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NavController } from 'ionic-angular';
import { EnvVariables } from '../../app/environment-variables/environment-variables.token';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    @Inject(EnvVariables) public envVariables,
    private iab: InAppBrowser
  ) {

  }

  popMenu() {
    this.navCtrl.pop();
  }

  login(site: string) {
    this.iab.create(this.envVariables.apiEndpoint + '/api/v1.0/users/auth/' + site, '_self');
  }
}
