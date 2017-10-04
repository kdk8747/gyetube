import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../providers';
import { User } from '../../models';

@IonicPage({
  segment: 'menu',
  defaultHistory: ['TabsMyPage']
})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  loggedIn: boolean = false;
  user: User;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public userService: UserService,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) {

  }

  ionViewDidLoad() {
    this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          let userId = payload.id;
          this.userService.getUser(userId).subscribe(
            (user: User) => {
              this.loggedIn = true;
              this.user = user;
            },
            (error: any) => {
              this.storage.clear();
              console.log(error);
            });
        }
      }
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('TabsMyPage');
    else
      this.navCtrl.pop();
  }

  pushLogin() {
    this.popNavigation();
    this.navCtrl.push('LoginPage');
  }

  signOut() {
    this.storage.clear()
      .then(() => {
        this.translate.get('I18N_SIGN_OUT_TOAST').subscribe(
          (value) => {
            let toast = this.toastCtrl.create({
              duration: 3000,
              message: value
            });
            toast.present();
            this.navCtrl.setRoot('TabsMyPage'); // DO NOT USE this.popNavigation(); because of user profile refresh issue.
          });
      });
  }
}
