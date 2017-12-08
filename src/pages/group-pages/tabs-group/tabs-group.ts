import { Component, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ViewController, Nav } from 'ionic-angular';
import { MemberService, UtilService, GroupService, ProceedingService, DecisionService, ActivityService, ReceiptService, SharedDataService } from '../../../providers';


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

  responseTimeMs: number = 80;

  constructor(
    public element: ElementRef,
    public renderer: Renderer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public groupService: GroupService,
    public proceedingService: ProceedingService,
    public decisionService: DecisionService,
    public activityService: ActivityService,
    public receiptService: ReceiptService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.groupService.getGroupId(this.navParams.get('group_url_segment')).then(group_id => {
      this.groupService.getGroup(group_id).subscribe(group => this.sharedDataService.headerGroupTitle = group.title);
      this.util.setCurrentGroupId(group_id);
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
    this.event.unsubscribe('TabsGroup_HideTab');
    this.event.unsubscribe('TabsGroup_ShowTab');
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
