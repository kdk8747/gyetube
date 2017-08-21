import { Component, ViewChild } from '@angular/core';

import { Platform, Nav } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // make TabsPage the root (or first) page
  rootPage = TabsPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService
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
}
