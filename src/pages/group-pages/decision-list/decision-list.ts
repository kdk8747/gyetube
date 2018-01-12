import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { UtilService, MemberService, DecisionService, SharedDataService } from '../../../providers';
import { DecisionListElement } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'decision-list'
})
@Component({
  selector: 'page-decision-list',
  templateUrl: 'decision-list.html',
})
export class DecisionListPage {

  groupId: number;
  memberState: string;
  decisions: Observable<DecisionListElement[]>;
  readPermitted: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.event.subscribe('DecisionList_Refresh', () => {
      this.refreshDecisions();
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    try {
      this.util.getCurrentGroup().then(group => {
        this.groupId = group.group_id;
        this.sharedDataService.headerGroupTitle = group.title;

        this.memberService.getMemberMyself(group.group_id).subscribe(member => {
          this.memberState = member.member_state;
          this.readPermitted = member.role.decision.some(val => val == 'READ');
        }, (err) => {
          this.readPermitted = false;
        });
        this.refreshDecisions();
      });

    } catch (err) {
      console.log(err);
    }
  }

  ionViewWillUnload() {
    this.event.unsubscribe('DecisionList_Refresh');
  }

  navigateToDetail(decisionId: number) {
    if (!this.sharedDataService.decisionEditMode)
      this.navCtrl.push('DecisionDetailPage', { id: decisionId });
  }

  navigateToEditor() {
    this.navCtrl.push('DecisionEditorPage');
  }

  navigateToEditorForUpdate(id: number) {
    this.navCtrl.push('DecisionEditorPage', { id: id });
  }

  sortByDate(decisions: DecisionListElement[]): DecisionListElement[] {
    return decisions.sort((h1, h2) => {
      return h1.meeting_datetime < h2.meeting_datetime ? 1 :
        (h1.meeting_datetime > h2.meeting_datetime ? -1 : 0);
    });
  }

  filterPastDecisions(decisions: DecisionListElement[]): DecisionListElement[] {
    return decisions.filter(decision =>
      (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED')
      && new Date(decision.expiry_datetime).getTime() > new Date(Date.now()).getTime()
      && decision.next_id == 0
    );
  }

  filterDeletedDecisions(decisions: DecisionListElement[]): DecisionListElement[] {
    return decisions.filter(decision =>
      (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED')
    );
  }

  refreshDecisions() {
    this.decisions = this.decisionService.getDecisions(this.groupId)
      .map((decisions: DecisionListElement[]) =>
        this.sharedDataService.decisionListTimelineMode ?
          this.sortByDate(decisions) :
          this.sortByDate(this.filterPastDecisions(decisions)));
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshDecisions();
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }
}
