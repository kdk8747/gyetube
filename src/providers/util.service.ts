import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare const process: any; // Typescript compiler will complain without this

@Injectable()
export class UtilService {

  groupId: string = '';

  constructor(
    public platform: Platform
  ) { }

  isNativeApp(): boolean {
    console.log('platform : ' + this.platform.platforms().join(', '));
    if (process.env.IONIC_ENV === 'prod')
      return !document.URL.startsWith('http');
    else
      return this.platform.is('mobile'); // CAUTION: This code can't determine whether it's in a mobile web browser or in a native app.
  }

  setCurrentGroupId(group_id: string) {
    this.groupId = group_id;
  }

  getCurrentGroupId() {
    if (!this.isNativeApp()) {
      let splits = window.location.href.split('/');
      if (splits.length > 5) {
        return splits[4];
      }
    }
    return this.groupId;
  }
}
