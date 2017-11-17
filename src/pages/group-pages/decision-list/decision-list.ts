import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { UtilService, DecisionService, SharedDataService } from '../../../providers';
import { Decision } from '../../../models';
import { State } from '../../../app/constants';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'decision-list'
})
@Component({
  selector: 'page-decision-list',
  templateUrl: 'decision-list.html',
})
export class DecisionListPage {

  groupId: string;
  decisions: Observable<Decision[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.refreshDecisions();

    this.event.subscribe('DecisionList_Refresh', () => {
      this.refreshDecisions();
    });
  }

  ionViewDidEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
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

  sortByDate(decisions: Decision[]): Decision[] {
    return decisions.sort((h1, h2) => {
      return h1.meetingDate < h2.meetingDate ? 1 :
        (h1.meetingDate > h2.meetingDate ? -1 : 0);
    });
  }

  filterPastDecisions(decisions: Decision[]): Decision[] {
    return decisions.filter(decision =>
      (decision.state == State.STATE_CREATED || decision.state == State.STATE_UPDATED)
      && new Date(decision.expiryDate).getTime() > new Date(Date.now()).getTime()
      && decision.nextId == 0
    );
  }

  filterDeletedDecisions(decisions: Decision[]): Decision[] {
    return decisions.filter(decision =>
      (decision.state == State.STATE_CREATED || decision.state == State.STATE_UPDATED)
    );
  }

  onDelete(decision: Decision): void {
    let found = this.sharedDataService.decisionChangesets.findIndex(item => item.id == decision.id);
    let newDecision = JSON.parse(JSON.stringify(decision)) as Decision;

    newDecision.prevId = decision.id;
    newDecision.state = State.STATE_PENDING_DELETE;
    newDecision.description = '';
    if (found != -1)
      this.sharedDataService.decisionChangesets[found] = newDecision;
    else
      this.sharedDataService.decisionChangesets.push(newDecision);
    this.navCtrl.parent.select(1);
    this.sharedDataService.decisionEditMode = false;
  }

  refreshDecisions() {
    this.decisions = this.decisionService.getDecisions(this.groupId)
      .map((decisions: Decision[]) =>
        this.sharedDataService.decisionListTimelineMode ?
          this.sortByDate(this.filterDeletedDecisions(decisions)) :
          this.sortByDate(this.filterPastDecisions(decisions)));
  }

  onFAB(fab: FabContainer) {
    fab.close();
    this.refreshDecisions();
  }
}
