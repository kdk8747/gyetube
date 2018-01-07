import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { UtilService, MemberService, SharedDataService } from '../../../providers';
import { MemberListElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


enum MemberListState {
  STATE_NORMAL,
  STATE_DELETED,
  STATE_PENDING,
}

@IonicPage({
  segment:'member-list'
})
@Component({
  selector: 'page-member-list',
  templateUrl: 'member-list.html',
})
export class MemberListPage {
  enum = MemberListState;

  memberListState: MemberListState = MemberListState.STATE_NORMAL;
  groupId: number;
  members: Observable<MemberListElement[]>;
  readPermitted: boolean = false;
  creationPermitted: boolean = false;

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
    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.refreshMembers();

      this.util.isPermitted('CREATE', 'member', this.groupId)
        .then(bool => this.creationPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });
    });
  }

  ionViewWillEnter() {
    this.translate.get('I18N_MEMBERS').subscribe(value => {
      this.sharedDataService.headerDetailTitle = value;
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

  navigateToDetail(member_id: number) {
    this.navCtrl.push('MemberDetailPage', { id: member_id });
  }

  navigateToEditor() {
    this.navCtrl.push('MemberEditorPage');
  }

  sortByDate(members: MemberListElement[]): MemberListElement[] {
    return members.sort((h1, h2) => {
      return h1.created_datetime < h2.created_datetime ? 1 :
        (h1.created_datetime > h2.created_datetime ? -1 : 0);
    });
  }

  refreshMembers() {
    this.members = this.memberService.getMembers(this.groupId)
      .map((members: MemberListElement[]) => {
        switch(this.memberListState) {
          case MemberListState.STATE_NORMAL :
            return this.sortByDate(members.filter(member => (member.document_state == 'ADDED' || member.document_state == 'UPDATED')));
          case MemberListState.STATE_DELETED :
            return this.sortByDate(members.filter(member => (member.document_state == 'DELETED')));
          case MemberListState.STATE_PENDING :
            return this.sortByDate(members.filter(member => (member.document_state == 'PENDING_ADDS' && member.next_id == 0)));
          default:
            return this.sortByDate(members);
        }
      });
    this.members.subscribe(() => this.readPermitted = true);
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshMembers();
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
