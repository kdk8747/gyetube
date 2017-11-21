import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SharedDataService } from '../providers';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make GroupListPage the root (or first) page
  rootPage: string = 'GroupListPage';


  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public sharedDataService: SharedDataService
  ) {
    this.initializeApp();
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

  onSplit(pane: HTMLElement) {
    this.sharedDataService.paneSplited = pane.classList.contains('split-pane-visible');
  }
}
