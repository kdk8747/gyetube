import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { UtilService, MemberService, SharedDataService } from '../../../providers';
import { MemberListElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';


enum MemberListState {
  STATE_NORMAL,
  STATE_DELETED,
  STATE_PENDING,
}

@IonicPage({
  segment: 'member-list'
})
@Component({
  selector: 'page-member-list',
  templateUrl: 'member-list.html',
})
export class MemberListPage {
  enum = MemberListState;
  memberListState: MemberListState = MemberListState.STATE_NORMAL;

  members: MemberListElement[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
  }

  ionViewDidLoad() {
    this.refreshMembers();

    this.event.subscribe('MemberList_Refresh', () => {
      this.refreshMembers();
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('MemberList_Refresh');
  }

  ionViewWillEnter() {
    this.translate.get('I18N_MEMBERS').subscribe(value => {
      this.sharedDataService.headerDetailTitle = this.sharedDataService.headerGroupTitle + ' - ' + value;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('GroupHomePage');
    else
      this.navCtrl.pop();
  }

  navigateToDetail(member_id: number, member_log_id: number) {
    this.navCtrl.push('MemberDetailPage', { id: member_id, log_id: member_log_id });
  }

  navigateToEditor() {
    this.navCtrl.push('MemberEditorPage');
  }

  sortByDate(members: MemberListElement[]): MemberListElement[] {
    return members.sort((h1, h2) => {
      return h1.modified_datetime < h2.modified_datetime ? 1 :
        (h1.modified_datetime > h2.modified_datetime ? -1 : 0);
    });
  }

  refreshMembers() {
    switch (this.memberListState) {
      case MemberListState.STATE_NORMAL:
        this.members = this.sortByDate(this.sharedDataService.members.filter(member => (member.member_state == 'ADDED' || member.member_state == 'UPDATED' || member.member_state == 'JOIN_APPROVED')));
      case MemberListState.STATE_DELETED:
        this.members = this.sortByDate(this.sharedDataService.members.filter(member => (member.member_state == 'DELETED' || member.member_state == 'JOIN_REJECTED')));
      case MemberListState.STATE_PENDING:
        this.members = this.sortByDate(this.sharedDataService.members.filter(member => (member.member_state == 'JOIN_REQUESTED')));
      default:
        this.members = this.sortByDate(this.sharedDataService.members);
    }
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshMembers();
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
