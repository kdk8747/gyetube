import { Component, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { UserService, UtilService, GroupService, ProceedingService, DecisionService, ActivityService, ReceiptService } from '../../../providers';
import { User, Group } from '../../../models';
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

  loggedIn: boolean = false;
  user: User;
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
    public receiptService: ReceiptService
  ) {
  }

  ionViewDidLoad() {
    this.groupId = this.navParams.get('group_id');
    this.group = this.groupService.getGroup(this.groupId);

    this.group.subscribe((group: Group) => {
      this.event.publish('App_ShowGroupTitleHeader', { title: group.title });
      group.members.map(id => this.userService.cacheUser(id));
      this.proceedingService.cacheProceedings(group.id);
      this.decisionService.cacheDecisions(group.id);
      this.activityService.cacheActivities(group.id);
      this.receiptService.cacheReceipts(group.id);
    });

    this.util.getCurrentUser()
      .then((user: User) => {
        this.responseTimeMs = this.userService.getResponseTimeMs();
        this.loggedIn = true;
        this.user = user;
      }).catch((error: any) => {
        console.log(error);
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
      this.navCtrl.getActiveChildNavs()[0].select(1);
      setTimeout(() => {
        let childNav = this.navCtrl.getActiveChildNavs()[0]._tabs[1];
        let top: ViewController = childNav.last();
        if (top.id !== 'ProceedingDetailPage' || top.data.id !== obj.id)
          childNav.setRoot('ProceedingDetailPage', { id: obj.id });
      }, this.responseTimeMs);
    });

    this.event.subscribe('TabsGroup_DecisionDetail', (obj) => {
      this.navCtrl.getActiveChildNavs()[0].select(2);
      setTimeout(() => {
        let childNav = this.navCtrl.getActiveChildNavs()[0]._tabs[2];
        let top: ViewController = childNav.last();
        if (top.id !== 'DecisionDetailPage' || top.data.id !== obj.id)
          childNav.setRoot('DecisionDetailPage', { id: obj.id });
      }, this.responseTimeMs);
    });

    this.event.subscribe('TabsGroup_ActivityDetail', (obj) => {
      this.navCtrl.getActiveChildNavs()[0].select(3);
      setTimeout(() => {
        let childNav = this.navCtrl.getActiveChildNavs()[0]._tabs[3];
        let top: ViewController = childNav.last();
        if (top.id !== 'ActivityDetailPage' || top.data.id !== obj.id)
          childNav.setRoot('ActivityDetailPage', { id: obj.id });
      }, this.responseTimeMs);
    });

    this.event.subscribe('TabsGroup_ReceiptDetail', (obj) => {
      this.navCtrl.getActiveChildNavs()[0].select(4);
      setTimeout(() => {
        let childNav = this.navCtrl.getActiveChildNavs()[0]._tabs[4];
        let top: ViewController = childNav.last();
        if (top.id !== 'ReceiptDetailPage' || top.data.id !== obj.id)
          childNav.setRoot('ReceiptDetailPage', { id: obj.id });
      }, this.responseTimeMs);
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

  ionViewDidEnter() {
    console.log('tab enter');
  }
}
