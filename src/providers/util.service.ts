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

  getCurrentUser(): Promise<User> {
    return this.getCurrentPayload().then(payload => {
      return this.userService.getUser(payload.id).toPromise();
    });
  }

  getCurrentMember(group_id: number): Promise<MemberDetailElement> {
    return this.getCurrentPayload().then(payload => {
      return this.memberService.getMember(group_id, payload.id).toPromise();
    });
  }

  getCurrentKnownGroups(): Promise<Group[]> {
    return this.getCurrentPayload().then(payload => {
      let groups: number[] = [];
      for (let groupId in payload.permissions.groups)
        groups.push(+groupId);
      return Promise.all(groups.map((groupId: number) =>
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

  isPermitted(query_crud: string, category: string, groupId: number): Promise<boolean> {
    let groupRoles;
    return this.groupService.getGroup(groupId).toPromise()
      .then((group: Group) => {
        groupRoles = [
          {id: 'anyone', name:'아무나', proceedings:'____', decisions:'____', activities:'_r__', receipts:'_r__'},
          {id: 'member', name:'당원', proceedings:'_ru_', decisions:'_ru_', activities:'crud', receipts:'crud'},
          {id: 'commitee', name:'운영위원', proceedings:'cru_', decisions:'_ru_', activities:'crud', receipts:'crud'}
        ];//group.roles;
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
