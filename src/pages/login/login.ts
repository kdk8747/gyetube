import { Component, Inject } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { EnvVariables } from '../../app/environment-variables/environment-variables.token';

@IonicPage({
  segment: 'login',
  defaultHistory: ['TabsMyPage']
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    @Inject(EnvVariables) public envVariables,
    private iab: InAppBrowser,
    private storage: Storage,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) { }

  ionViewDidLoad() {
    let splits = window.location.href.split('token=');
    if (splits.length > 1) {
      console.log(splits[1]);
      this.afterLoggedIn(splits[1]);
    }
    else {
      console.log('no token');
    }
  }

  popMenu() {
    this.navCtrl.pop();
  }

  isNativeApp(): boolean {
    return !document.URL.startsWith('http');
  }

  login(site: string) {
    let url: string = this.envVariables.apiEndpoint + '/api/v1.0/users/auth/' + site;
    if (this.isNativeApp()) {
      this.loginWithNativeApp(url).then((eventUrl: string) => {
        let token = eventUrl.split('=')[1].split('&')[0];
        this.afterLoggedIn(token);
      }, (err: string) => {
        console.log(err);
      });
    }
    else {
      this.loginWithBrowser(url);
    }
  }

  loginWithNativeApp(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let browser = this.iab.create(url, '_self');
      let listener = browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
        //Ignore the dropbox authorize screen
        if (event.url.indexOf('oauth2/authorize') > -1) {
          return;
        }

        //Check the redirect uri
        if (event.url.indexOf(this.envVariables.apiEndpoint) > -1) {
          listener.unsubscribe();
          browser.close();
          resolve(event.url);
        } else {
          reject("Could not authenticate");
        }
      });
    });
  }

  loginWithBrowser(url: string) {
    window.open(url, '_self');
  }

  afterLoggedIn(token: string) {
    this.storage.set('currentUserToken', token);
    this.translate.get('I18N_SIGN_IN_TOAST').subscribe(
      (value) => {
        let toast = this.toastCtrl.create({
          duration: 3000,
          message: value
        });
        toast.present();
      });
    this.navCtrl.setRoot('TabsMyPage');
  }
}
