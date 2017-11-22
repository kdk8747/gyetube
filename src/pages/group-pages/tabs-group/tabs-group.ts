import { Component, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, Nav } from 'ionic-angular';
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
      let childNav: Nav = this.navCtrl.getActiveChildNavs()[0]._tabs[1];
      if (childNav.length() == 0) {
        this.navCtrl.getActiveChildNavs()[0].select(1);
        setTimeout(() => childNav.setRoot('ProceedingDetailPage', obj), this.responseTimeMs);
      }
      else {
        this.setRootToChildNav(childNav, 'ProceedingDetailPage', obj);
        setTimeout(() => this.navCtrl.getActiveChildNavs()[0].select(1), 30);
      }
    });

    this.event.subscribe('TabsGroup_DecisionDetail', (obj) => {
      let childNav: Nav = this.navCtrl.getActiveChildNavs()[0]._tabs[2];
      if (childNav.length() == 0) {
        this.navCtrl.getActiveChildNavs()[0].select(2);
        setTimeout(() => childNav.setRoot('DecisionDetailPage', obj), this.responseTimeMs);
      }
      else {
        this.setRootToChildNav(childNav, 'DecisionDetailPage', obj);
        setTimeout(() => this.navCtrl.getActiveChildNavs()[0].select(2), 30);
      }
    });

    this.event.subscribe('TabsGroup_ActivityDetail', (obj) => {
      let childNav: Nav = this.navCtrl.getActiveChildNavs()[0]._tabs[3];
      if (childNav.length() == 0) {
        this.navCtrl.getActiveChildNavs()[0].select(3);
        setTimeout(() => childNav.setRoot('ActivityDetailPage', obj), this.responseTimeMs);
      }
      else {
        this.setRootToChildNav(childNav, 'ActivityDetailPage', obj);
        setTimeout(() => this.navCtrl.getActiveChildNavs()[0].select(3), 30);
      }
    });

    this.event.subscribe('TabsGroup_ReceiptDetail', (obj) => {
      let childNav: Nav = this.navCtrl.getActiveChildNavs()[0]._tabs[4];
      if (childNav.length() == 0) {
        this.navCtrl.getActiveChildNavs()[0].select(4);
        setTimeout(() => childNav.setRoot('ReceiptDetailPage', obj), this.responseTimeMs);
      }
      else {
        this.setRootToChildNav(childNav, 'ReceiptDetailPage', obj);
        setTimeout(() => this.navCtrl.getActiveChildNavs()[0].select(4), 30);
      }
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

  setRootToChildNav(childNav: Nav, page: string, obj: any) {
    let top: ViewController = childNav.last();
    if (top.id !== page || top.data.id !== obj.id)
      childNav.setRoot(page, obj);
  }
}
