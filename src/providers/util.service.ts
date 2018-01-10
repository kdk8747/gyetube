import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { GroupService, RoleService } from './';
import { User } from '../models';
import { Observable } from 'rxjs/Observable';

declare const process: any; // Typescript compiler will complain without this

@Injectable()
export class UtilService {

  groupId: number = 0;

  constructor(
    public platform: Platform,
    public storage: Storage,
    public event: Events,
    public groupService: GroupService,
    public roleService: RoleService,
    public translate: TranslateService
  ) { }

  isNativeApp(): boolean {
    console.log('platform : ' + this.platform.platforms().join(', '));
    if (process.env.IONIC_ENV === 'prod')
      return !document.URL.startsWith('http');
    else
      return this.platform.is('mobile'); // CAUTION: This code can't determine whether it's in a mobile web browser or in a native app.
  }

  setCurrentGroupId(group_id: number): void {
    this.groupId = group_id;
  }

  getCurrentGroupId(): Promise<number> {
    if (this.groupId) return Promise.resolve(this.groupId);

    if (!this.isNativeApp()) {
      let splits = window.location.href.split('/');
      let i = splits.findIndex((str: string) => str === 'group-page');
      if (i >= 0)
        return this.groupService.getGroupId(splits[i - 1]);
    }
    return Promise.reject('getCurrentGroupId() error');
  }

  private getCurrentPayload(): Promise<any> {
    return this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          return Promise.resolve(payload);
        }
      }
      this.storage.clear();
      return Promise.reject('invalid token');
    });
  }

  setToken(token: string): Promise<void> {
    return this.storage.set('currentUserToken', token);
  }

  pageGetReady(): Promise<number> {
    return this.getCurrentGroupId(); /*.then(group_id =>
      this.getAnyoneToken(group_id).then(() => group_id));*/
  }

  isPermitted(query_crud: string, category: string, groupId: number): Promise<boolean> {
    return this.roleService.getRoleMyself(groupId).toPromise()
    .then((role) => {
        return role[category].some(val => val == query_crud);
    });
  }

  getCurrentUser(): Promise<User> {
    return this.getCurrentPayload().then(payload => {
      return new User(payload.user_id, decodeURIComponent(payload.name), decodeURIComponent(payload.image_url), payload.third_party);
    });
  }

  onContentScroll(event) {
    if (event.velocityY > 10.0 || event.scrollTop < 56) {
      this.event.publish('App_ShowHeader');
      this.event.publish('TabsGroup_ShowTab');
    }
    else if (event.directionY == 'down') {
      this.event.publish('App_HideHeader');
      this.event.publish('TabsGroup_HideTab');
    }
  }

  toIsoStringWithTimezoneOffset(date: Date): string {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
  }

  translateDBString(str: string): Observable<string> {
    switch(str) {
      case 'ANYONE':
      case 'MEMBER':
      case 'COMMITEE':
        return this.translate.get('I18N_' + str);
      default:
        return new Observable<string>(obs => obs.next(str));
    }
  }
}
