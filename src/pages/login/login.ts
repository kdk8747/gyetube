import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EnvVariables } from '../../app/environment-variables/environment-variables.token';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    @Inject(EnvVariables) public envVariables
  ) {

  }

  popMenu() {
    this.navCtrl.pop();
  }

  login(site: string): boolean {
    var ref = window.open(this.envVariables.apiEndpoint + '/api/v1.0/users/auth/' + site, '_system', 'location=yes');
    ref.addEventListener('loadstart', function(event) { alert('start: ' + event); });
    ref.addEventListener('loadstop', function(event) { alert('stop: ' + event); });
    ref.addEventListener('loaderror', function(event) { alert('error: ' + event); });
    ref.addEventListener('exit', function(event) { alert(event); });
    return false;
  }
}
