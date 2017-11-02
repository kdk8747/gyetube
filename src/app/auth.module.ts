import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import { Cookies } from 'js-cookie';

let storage = new Storage({});

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('currentUserToken')
    .then((token: string) => token)
    .catch(() => <string>Cookies.get('currentUserToken'))),  // fallback for safari private mode.
  }), http);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    }
  ]
})
export class AuthModule {}
