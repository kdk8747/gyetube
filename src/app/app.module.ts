import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { EnvironmentsModule } from './environment-variables/environment-variables.module';

import { GroupListPage } from '../pages/group-list/group-list';
import { UncheckedListPage } from '../pages/unchecked-list/unchecked-list';
import { NotificationListPage } from '../pages/notification-list/notification-list';
import { TabsPage } from '../pages/tabs/tabs';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { MenuPage } from '../pages/menu/menu';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    GroupListPage,
    UncheckedListPage,
    NotificationListPage,
    TabsPage,
    ItemDetailsPage,
    ListPage,
    MenuPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    EnvironmentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GroupListPage,
    UncheckedListPage,
    NotificationListPage,
    TabsPage,
    ItemDetailsPage,
    ListPage,
    MenuPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
