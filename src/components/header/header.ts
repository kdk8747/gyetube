import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { Nav, Events } from 'ionic-angular';
import { UtilService, UserService, SharedDataService } from '../../providers';
import { User } from '../../models';


@Component({
  selector: 'grasscube-header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  @Input() nav: Nav;

  constructor(
    public event: Events,
    public element: ElementRef,
    public renderer: Renderer,
    public util: UtilService,
    public userService: UserService,
    public sharedDataService: SharedDataService
  ) {

    this.event.subscribe('App_ShowAvatarToHeader', () => {
      this.util.getCurrentUser()
        .then((user: User) => {
          this.sharedDataService.loggedIn = true;
          this.sharedDataService.loggedInUser = user;
          return this.util.convertToDataURLviaCanvas('http://reverse-proxy.grassroots.kr/' + user.imageUrl);
        }).then(base64Img => {
          if (base64Img !== this.sharedDataService.loggedInUser.imageBase64) {
            this.sharedDataService.loggedInUser.imageBase64 = base64Img;
            return this.userService.update(this.sharedDataService.loggedInUser).toPromise();
          }
          return Promise.reject('user.imageBase64 has been updated already');
        }).catch((error: any) => {
          console.log(error);
        });
    });

    this.event.subscribe('App_HideHeader', () => {
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'opacity', '0');
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'z-index', '0');
      //this.renderer.setElementStyle(this.element.nativeElement.children[0], 'top', '-56px'); // too slow at mobile web
    });

    this.event.subscribe('App_ShowHeader', () => {
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'opacity', '1');
      this.renderer.setElementStyle(this.element.nativeElement.children[0], 'z-index', '10');
      //this.renderer.setElementStyle(this.element.nativeElement.children[0], 'top', '0px');
    });

    this.event.publish('App_ShowAvatarToHeader');
  }

  popNavigation() {
    if (this.sharedDataService.headerDetailTitle) {
      let selectedTabIndex = this.nav.getActiveChildNavs()[0].getSelected().index;
      let childNav = this.nav.getActiveChildNavs()[0]._tabs[selectedTabIndex];
      this.sharedDataService.headerDetailTitle = null;
      if (childNav.length() == 1)
        childNav.setRoot('ProceedingListPage');
      else
        childNav.pop();
    }
    else {
      this.sharedDataService.headerGroupTitle = null;
      if (this.nav.length() == 1)
        this.nav.setRoot('GroupListPage');
      else
        this.nav.pop();
    }
  }

}
