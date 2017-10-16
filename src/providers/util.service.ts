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

  setCurrentGroupId(group_id: string): void {
    this.groupId = group_id;
  }

  getCurrentGroupId(): string {
    if (!this.isNativeApp()) {
      let splits = window.location.href.split('/');
      let i = splits.findIndex((str:string) => str === 'group-page');
      if (i >= 0)
        return splits[i - 1];
    }
    return this.groupId;
  }

  convertToDataURLviaCanvas(url: string): Promise<string> {
    return new Promise( (resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = function(){
        let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
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
