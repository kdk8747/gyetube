import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GroupService, UserService } from './';
import { User, Group } from '../models';

declare const process: any; // Typescript compiler will complain without this

@Injectable()
export class UtilService {

  groupId: string = '';

  constructor(
    public platform: Platform,
    public storage: Storage,
    public groupService: GroupService,
    public userService: UserService,
  ) { }

  isNativeApp(): boolean {
    console.log('platform : ' + this.platform.platforms().join(', '));
    if (process.env.IONIC_ENV === 'prod')
      return !document.URL.startsWith('http');
    else
      return this.platform.is('mobile'); // CAUTION: This code can't determine whether it's in a mobile web browser or in a native app.
  }

  setCurrentGroupId(group_id: string): void {
    this.groupId = group_id;
  }

  getCurrentGroupId(): string {
    if (!this.isNativeApp()) {
      let splits = window.location.href.split('/');
      let i = splits.findIndex((str: string) => str === 'group-page');
      if (i >= 0)
        return splits[i - 1];
    }
    return this.groupId;
  }

  getCurrentUser(): Promise<User> {
    return this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          return this.userService.getUser(payload.id).toPromise();
        }
      }
      this.storage.clear();
      return Promise.reject('invalid token');
    });
  }

  getCurrentKnownGroups(): Promise<Group[]> {
    return this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          let groups: string[] = [];
          for (let groupId in payload.permissions.groups)
            groups.push(groupId);
          return Promise.all(groups.map((groupId: string) =>
            this.groupService.getGroup(groupId).toPromise()));
        }
      }
      this.storage.clear();
      return Promise.reject([]);
    });
  }

  convertToDataURLviaCanvas(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = function () {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL: string;
        canvas.height = 37;
        canvas.width = 37;
        ctx.drawImage(img,
          0, 0, img.width, img.height,
          0, 0, canvas.width, canvas.height
        );
        dataURL = canvas.toDataURL('image/png');
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }
}
