import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GroupService, UserService, MemberService } from './';
import { User, Group, MemberDetailElement } from '../models';

declare const process: any; // Typescript compiler will complain without this

@Injectable()
export class UtilService {

  groupId: number = 0;

  constructor(
    public platform: Platform,
    public storage: Storage,
    public event: Events,
    public groupService: GroupService,
    public userService: UserService,
    public memberService: MemberService
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

  isPermitted(query_crud: string, category: string, groupId: number): Promise<boolean> {
    return this.getCurrentPayload()
    .then((payload) => {
      if (groupId in payload.permissions.groups) {
        let permission = payload.permissions.groups[groupId][category];

        switch(query_crud) {
          case 'create': return (permission & 1) != 0;
          case 'read':   return (permission & 2) != 0;
          case 'update': return (permission & 4) != 0;
          case 'delete': return (permission & 8) != 0;
          default: console.log('Unknown query_crud');
        }
        return false;
      }
      return false;
    });
  }

  getCurrentUser(): Promise<User> {
    return this.getCurrentPayload().then(payload => {
      return new User(payload.user_id, decodeURIComponent(payload.name), payload.image_url, payload.third_party);
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
}
