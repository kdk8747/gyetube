import { Component, Inject } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, ToastController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { EnvVariables } from '../../app/environment-variables/environment-variables.token';
import { UtilService } from '../../providers';
import { Cookies } from 'js-cookie';

@IonicPage({
  segment: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public util: UtilService,
    @Inject(EnvVariables) public envVariables,
    public iab: InAppBrowser,
    public storage: Storage,
    public event: Events,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) { }

  ionViewDidLoad() {
    if (!this.util.isNativeApp()) {
      let splits = window.location.href.split('token=');
      if (splits.length > 1) {
        console.log(splits[1]);
        this.afterLoggedIn(splits[1]).catch(() => {
          Cookies.set('currentUserToken', splits[1]);  // fallback for safari private mode.
        });
      }
      else {
        console.log('no token');
      }
    }
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('GroupListPage');
    else
      this.navCtrl.pop();
  }

  login(site: string) {
    let url: string = this.envVariables.apiEndpoint + '/api/v1.0/users/auth/' + site;
    if (this.util.isNativeApp()) {
      this.loginWithNativeApp(url).then((eventUrl: string) => {
        let token = eventUrl.split('=')[1].split('&')[0];
        return this.afterLoggedIn(token);
      }).catch((err: string) => {
        console.log(err);
      });
    }
    else {
      this.loginWithBrowser(url);
    }
  }

  loginWithNativeApp(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let browser = this.iab.create(url, '_blank');
      let listener = browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
        if (event.url.indexOf(this.envVariables.apiEndpoint + '/#/login?token=') > -1) {
          listener.unsubscribe();
          browser.close();
          resolve(event.url);
        }
      });
    });
  }

  loginWithBrowser(url: string) {
    window.open(url, '_self');
  }

  afterLoggedIn(token: string): Promise<void> {
    return this.storage.set('currentUserToken', token)
      .then(() => {
        this.translate.get('I18N_SIGN_IN_TOAST').subscribe(
          (value) => {
            let toast = this.toastCtrl.create({
              duration: 3000,
              message: value
            });
            toast.present();
            this.event.publish('App_ShowAvatarToHeader');
            this.popNavigation();
          });
      });
  }
}
