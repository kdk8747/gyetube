import { Component, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ViewController, Nav } from 'ionic-angular';
import { UserService, UtilService, GroupService, ProceedingService, DecisionService, ActivityService, ReceiptService, SharedDataService } from '../../../providers';
import { Group } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: ':group_id/group-page'
})
@Component({
  selector: 'page-tabs-group',
  templateUrl: 'tabs-group.html',
})
export class TabsGroupPage {
  tab1Root: string = 'GroupHomePage';
  tab2Root: string = 'ProceedingListPage';
  tab3Root: string = 'DecisionListPage';
  tab4Root: string = 'ActivityListPage';
  tab5Root: string = 'ReceiptListPage';

  groupId: string = '';
  group: Observable<Group>;
  responseTimeMs: number = 500;

  constructor(
    public element: ElementRef,
    public renderer: Renderer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public groupService: GroupService,
    public proceedingService: ProceedingService,
    public decisionService: DecisionService,
    public activityService: ActivityService,
    public receiptService: ReceiptService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.groupId = this.navParams.get('group_id');
    this.group = this.groupService.getGroup(this.groupId);

    this.group.subscribe((group: Group) => {
      this.sharedDataService.headerGroupTitle = group.title;
      group.members.map(id => this.userService.cacheUser(id));
      if (group.members.length > 0)
        this.userService.getUser(group.members[0]).subscribe(() => this.responseTimeMs = this.userService.getResponseTimeMs());
      this.proceedingService.cacheProceedings(group.id);
      this.decisionService.cacheDecisions(group.id);
      this.activityService.cacheActivities(group.id);
      this.receiptService.cacheReceipts(group.id);
    });

    this.event.subscribe('TabsGroup_HideTab', (obj) => {
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'opacity', '0');
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'z-index', '0');
    });

    this.event.subscribe('TabsGroup_ShowTab', (obj) => {
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'opacity', '1');
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'z-index', '10');
    });

    this.event.subscribe('TabsGroup_ProceedingDetail', (obj) => {
      this.switchDetailPage(1, 'ProceedingDetailPage', obj);
    });

    this.event.subscribe('TabsGroup_DecisionDetail', (obj) => {
      this.switchDetailPage(2, 'DecisionDetailPage', obj);
    });

    this.event.subscribe('TabsGroup_ActivityDetail', (obj) => {
      this.switchDetailPage(3, 'ActivityDetailPage', obj);
    });

    this.event.subscribe('TabsGroup_ReceiptDetail', (obj) => {
      this.switchDetailPage(4, 'ReceiptDetailPage', obj);
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('TabsGroup_HideTab');
    this.event.unsubscribe('TabsGroup_ShowTab');
    this.event.unsubscribe('TabsGroup_ProceedingDetail');
    this.event.unsubscribe('TabsGroup_DecisionDetail');
    this.event.unsubscribe('TabsGroup_ActivityDetail');
    this.event.unsubscribe('TabsGroup_ReceiptDetail');
  }

  switchDetailPage(tabIndex: number, page: string, obj:any) {
    let childNav: Nav = this.navCtrl.getActiveChildNavs()[0]._tabs[tabIndex];
    if (childNav.length() == 0) {
      this.navCtrl.getActiveChildNavs()[0].select(tabIndex);
      setTimeout(() => childNav.setRoot(page, obj), this.responseTimeMs);
    }
    else {
      if (this.setRootToChildNav(childNav, page, obj)) {
        setTimeout(() => this.navCtrl.getActiveChildNavs()[0].select(tabIndex), this.responseTimeMs);
        this.showLoadingSpinner();
      }
      else
        this.navCtrl.getActiveChildNavs()[0].select(tabIndex);
    }
  }

  setRootToChildNav(childNav: Nav, page: string, obj: any): boolean {
    let top: ViewController = childNav.last();
    if (top.id !== page || top.data.id !== obj.id) {
      childNav.setRoot(page, obj);
      return true;
    }
    return false;
  }

  showLoadingSpinner() {
    if (this.responseTimeMs > 100) {
      let loading = this.loadingCtrl.create();
      loading.present();
      setTimeout(() => loading.dismiss(), this.responseTimeMs);
    }
  }
}
