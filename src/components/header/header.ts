import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { Nav, Events } from 'ionic-angular';
import { UtilService, UserService, SharedDataService } from '../../providers';
import { User } from '../../models';


@Component({
  selector: 'gyetube-header',
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
          if (user.user_id && user.name && user.image_url && user.third_party) {
            this.sharedDataService.loggedIn = true;
            this.sharedDataService.loggedInUser = user;
          }
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

    setTimeout(() => this.event.publish('App_ShowAvatarToHeader'), 300);
  }

  popNavigation() {
    if (this.sharedDataService.headerDetailTitle) {
      let selectedTabIndex = this.nav.getActiveChildNavs()[0].getSelected().index;
      let childNav = this.nav.getActiveChildNavs()[0]._tabs[selectedTabIndex];
      if (childNav.length() == 1) {
        switch (selectedTabIndex) {
          case 0: childNav.setRoot('GroupHomePage'); break;
          case 1: childNav.setRoot('ProceedingListPage'); break;
          case 2: childNav.setRoot('DecisionListPage'); break;
          case 3: childNav.setRoot('ActivityListPage'); break;
          case 4: childNav.setRoot('ReceiptListPage'); break;
          default: break;
        }
      }
      else {
        childNav.pop();
      }
      this.sharedDataService.headerDetailTitle = null;
      if (selectedTabIndex == 1) {
        this.sharedDataService.decisionEditMode = false;
        this.sharedDataService.decisionChangesets = [];
      }
    }
    else {
      if (this.nav.length() == 1)
        this.nav.setRoot('GroupListPage');
      else
        this.nav.pop();
      this.sharedDataService.headerGroupTitle = null;
      this.sharedDataService.decisionEditMode = false;
      this.sharedDataService.decisionChangesets = [];
    }
  }

}
