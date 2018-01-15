import { Component, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, LoadingController, Events, ViewController, Nav } from 'ionic-angular';
import { UtilService, MemberService, RoleService, ProceedingService, DecisionService, ActivityService, ReceiptService, SharedDataService } from '../../../providers';


@IonicPage({
  segment: ':group_url_segment/group-page'
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

  responseTimeMs: number = 100;

  constructor(
    public element: ElementRef,
    public renderer: Renderer,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public roleService: RoleService,
    public proceedingService: ProceedingService,
    public decisionService: DecisionService,
    public activityService: ActivityService,
    public receiptService: ReceiptService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewWillEnter() {
    this.event.publish('TabsGroup_Refresh');
  }

  ionViewDidLoad() {
    this.event.subscribe('TabsGroup_Refresh', (obj) => {
      this.util.getCurrentGroup().then(group => {
        this.sharedDataService.group = group;
        this.sharedDataService.headerGroupTitle = group.title;

        this.memberService.getMembers(group.group_id).subscribe(
          roles => { this.sharedDataService.members = roles; this.event.publish('MemberList_Refresh'); },
          err => { this.sharedDataService.members = []; this.event.publish('MemberList_Refresh'); }
        );
        this.roleService.getRoles(group.group_id).subscribe(
          roles => { this.sharedDataService.roles = roles; this.event.publish('RoleList_Refresh'); },
          err => { this.sharedDataService.roles = []; this.event.publish('RoleList_Refresh'); }
        );
        this.proceedingService.getProceedings(group.group_id).subscribe(
          roles => { this.sharedDataService.proceedings = roles; this.event.publish('ProceedingList_Refresh'); },
          err => { this.sharedDataService.proceedings = []; this.event.publish('ProceedingList_Refresh'); }
        );
        this.decisionService.getDecisions(group.group_id).subscribe(
          roles => { this.sharedDataService.decisions = roles; this.event.publish('DecisionList_Refresh'); },
          err => { this.sharedDataService.decisions = []; this.event.publish('DecisionList_Refresh'); }
        );
        this.activityService.getActivities(group.group_id).subscribe(
          roles => { this.sharedDataService.activities = roles; this.event.publish('ActivityList_Refresh'); },
          err => { this.sharedDataService.activities = []; this.event.publish('ActivityList_Refresh'); }
        );
        this.receiptService.getReceipts(group.group_id).subscribe(
          receipts => { this.sharedDataService.receipts = receipts; this.event.publish('ReceiptList_Refresh'); },
          err => { this.sharedDataService.receipts = []; this.event.publish('ReceiptList_Refresh'); }
        );
        this.memberService.getMemberMyself(group.group_id).subscribe(member => {
          this.sharedDataService.myselfMemberId = member.member_id;
          this.sharedDataService.myselfMemberLogId = member.member_log_id;
          this.sharedDataService.myselfState = member.member_state;
          this.sharedDataService.memberCreatePermitted = member.role.member.some(val => val == 'CREATE');
          this.sharedDataService.memberReadPermitted = member.role.member.some(val => val == 'READ');
          this.sharedDataService.roleCreatePermitted = member.role.role.some(val => val == 'CREATE');
          this.sharedDataService.roleReadPermitted = member.role.role.some(val => val == 'READ');
          this.sharedDataService.proceedingCreatePermitted = member.role.proceeding.some(val => val == 'CREATE');
          this.sharedDataService.proceedingReadPermitted = member.role.proceeding.some(val => val == 'READ');
          this.sharedDataService.decisionReadPermitted = member.role.decision.some(val => val == 'READ');
          this.sharedDataService.activityCreatePermitted = member.role.activity.some(val => val == 'CREATE');
          this.sharedDataService.activityReadPermitted = member.role.activity.some(val => val == 'READ');
          this.sharedDataService.receiptCreatePermitted = member.role.receipt.some(val => val == 'CREATE');
          this.sharedDataService.receiptReadPermitted = member.role.receipt.some(val => val == 'READ');
          this.sharedDataService.receiptInteractionPermitted = member.role.receipt.some(val => val == 'INTERACTION');
        }, (err) => {
          this.sharedDataService.myselfMemberId = 0;
          this.sharedDataService.myselfMemberLogId = 0;
          this.sharedDataService.myselfState = null;
          this.sharedDataService.memberCreatePermitted = false;
          this.sharedDataService.memberReadPermitted = false;
          this.sharedDataService.roleCreatePermitted = false;
          this.sharedDataService.roleReadPermitted = false;
          this.sharedDataService.proceedingCreatePermitted = false;
          this.sharedDataService.proceedingReadPermitted = false;
          this.sharedDataService.decisionReadPermitted = false;
          this.sharedDataService.activityCreatePermitted = false;
          this.sharedDataService.activityReadPermitted = false;
          this.sharedDataService.receiptCreatePermitted = false;
          this.sharedDataService.receiptReadPermitted = false;
          this.sharedDataService.receiptInteractionPermitted = false;
        });
      });
    });

    this.event.subscribe('TabsGroup_HideTab', (obj) => {
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'opacity', '0');
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'z-index', '0');
    });

    this.event.subscribe('TabsGroup_ShowTab', (obj) => {
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'opacity', '1');
      this.renderer.setElementStyle(this.element.nativeElement.children[0].children[0], 'z-index', '10');
    });

    this.event.subscribe('TabsGroup_MemberDetail', (obj) => {
      this.switchDetailPage(0, 'MemberDetailPage', obj);
    });

    this.event.subscribe('TabsGroup_RoleDetail', (obj) => {
      this.switchDetailPage(0, 'RoleDetailPage', obj);
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
    this.event.unsubscribe('TabsGroup_Refresh');
    this.event.unsubscribe('TabsGroup_HideTab');
    this.event.unsubscribe('TabsGroup_ShowTab');
    this.event.unsubscribe('TabsGroup_MemberDetail');
    this.event.unsubscribe('TabsGroup_RoleDetail');
    this.event.unsubscribe('TabsGroup_ProceedingDetail');
    this.event.unsubscribe('TabsGroup_DecisionDetail');
    this.event.unsubscribe('TabsGroup_ActivityDetail');
    this.event.unsubscribe('TabsGroup_ReceiptDetail');
  }

  switchDetailPage(tabIndex: number, page: string, obj: any) {
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
