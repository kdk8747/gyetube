import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
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
    public event: Events,
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

  getCurrentUser(): Promise<User> {
    return this.getCurrentPayload().then(payload => {
      return this.userService.getUser(payload.id).toPromise();
    });
  }

  getCurrentKnownGroups(): Promise<Group[]> {
    return this.getCurrentPayload().then(payload => {
      let groups: string[] = [];
      for (let groupId in payload.permissions.groups)
        groups.push(groupId);
      return Promise.all(groups.map((groupId: string) =>
        this.groupService.getGroup(groupId).toPromise()));
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

  isPermitted(query_crud: string, category: string, groupId: string): Promise<boolean> {
    let groupRoles;
    return this.groupService.getGroup(groupId).toPromise()
      .then((group: Group) => {
        groupRoles = group.roles;
        return this.getCurrentPayload();
      }).then(payload => {
        if (groupId in payload.permissions.groups) {
          let userRoles: string[] = payload.permissions.groups[groupId];

          let ret = false;
          for (let i = 0; i < userRoles.length; i++)
            for (let j = 0; j < groupRoles.length; j++)
              if (groupRoles[j].id == userRoles[i]) {
                let crud: string = '';
                switch(category) {
                  case 'proceedings': crud = groupRoles[j].proceedings; break;
                  case 'decisions': crud = groupRoles[j].decisions; break;
                  case 'activities': crud = groupRoles[j].activities; break;
                  case 'receipts': crud = groupRoles[j].receipts; break;
                }
                switch(query_crud) {
                  case 'create': ret = ret || crud.includes('c'); break;
                  case 'read':   ret = ret || crud.includes('r'); break;
                  case 'update': ret = ret || crud.includes('u'); break;
                  case 'delete': ret = ret || crud.includes('d'); break;
                }

              }
          return ret;
        }
        return false;
      });;
  }

  onContentScroll(event) {
    if (event.velocityY > 10.0 || event.scrollTop < 56) {
      this.event.publish('ShowHeader', {h: event.contentHeight});
    }
    else if (event.directionY == 'down') {
      this.event.publish('HideHeader', {h: event.contentHeight});
    }
  }
}
