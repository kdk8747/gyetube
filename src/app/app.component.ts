import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilService, UserService } from '../providers';
import { User } from '../models';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make GroupListPage the root (or first) page
  rootPage: string = 'GroupListPage';

  pages: Array<{title: string, icon: string, component: string}>;
  loggedIn: boolean = false;
  user: User = null;
  groupTitle: string = null;


  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,

    public element: ElementRef,
    public renderer: Renderer,

    public menu: MenuController,
    public storage: Storage,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public toastCtrl: ToastController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'I18N_GROUPS', icon: 'cube', component: 'GroupListPage' },
      { title: 'I18N_UNCHECKED', icon: 'eye-off', component: 'UncheckedListPage' },
      { title: 'I18N_NOTIFICATIONS', icon: 'notifications', component: 'NotificationListPage' }
    ];

    this.event.subscribe('LoginSucceed', () => {
      this.util.getCurrentUser()
        .then((user: User) => {
          this.loggedIn = true;
          this.user = user;
          return this.util.convertToDataURLviaCanvas('http://reverse-proxy.grassroots.kr/' + user.imageUrl);
        }).then( base64Img => {
          if (base64Img !== this.user.imageBase64){
            this.user.imageBase64 = base64Img;
            return this.userService.update(this.user).toPromise();
          }
          return Promise.reject('user.imageBase64 has been updated already');
        }).catch((error: any) => {
          console.log(error);
        });
    });

    this.event.subscribe('TabsGroupPageLoaded', (obj) => {
      this.groupTitle = obj.title;
    });

    this.event.subscribe('HideHeader', () => {
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'opacity', '0');
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'z-index', '0');
      //this.renderer.setElementStyle(this.element.nativeElement.children[0], 'top', '-56px'); // too slow at mobile web
    });

    this.event.subscribe('ShowHeader', ()=>{
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'opacity', '1');
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'z-index', '10');
      //this.renderer.setElementStyle(this.element.nativeElement.children[0], 'top', '0px');
    });

    this.event.publish('LoginSucceed');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    //this is to determine the text direction depending on the selected language
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      if (event.lang == 'ar') { // Arabic
        this.platform.setDir('rtl', true);
        this.platform.setDir('ltr', false);
      }
      else {
        this.platform.setDir('ltr', true);
        this.platform.setDir('rtl', false);
      }
    });
  }

  popNavigation() {
    if (this.nav.length() == 1)
      this.nav.setRoot('GroupListPage');
    else
      this.nav.pop();
  }

  onMenuItem() {
    this.menu.close();
    this.event.publish('ShowHeader');
    this.groupTitle = null;
  }

  onMenuItemPush(page: string) {
    this.menu.close();
    this.event.publish('ShowHeader');
    if (this.nav.last().id !== page)
      this.nav.push(page);
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
            this.loggedIn = false;
          });
      });
  }
}
