import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, FabContainer } from 'ionic-angular';
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
  stateEnum = State;

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

    this.event.subscribe('EventDecisionDetailPage', (obj) => {
      let top: ViewController = this.navCtrl.last();
      if (top.id !== 'DecisionDetailPage' || top.data.id !== obj.id)
        this.navCtrl.push('DecisionDetailPage', { id: obj.id });
    });
  }

  ionViewDidEnter() {
    this.event.publish('ShowHeader');
  }

  ionViewWillUnload() {
    this.event.unsubscribe('EventDecisionDetailPage');
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
    let decisionIdToIndex = {};
    for (let i = 0; i < decisions.length; i++)
      decisionIdToIndex[decisions[i].id] = i;

    let visitedIndex = new Array<boolean>(decisions.length).fill(false);
    for (let i = 0; i < decisions.length; i++) {
      if (decisions[i].prevId && decisionIdToIndex[decisions[i].prevId])
        visitedIndex[decisionIdToIndex[decisions[i].prevId]] = true;
      if (decisions[i].state == State.STATE_DELETED)
        visitedIndex[decisionIdToIndex[decisions[i].id]] = true;
    }

    return decisions.filter(decision => !visitedIndex[decisionIdToIndex[decision.id]]);
  }

  onDelete(decision: Decision): void {
    let found = this.sharedDataService.decisionChangesets.findIndex(item => item.prevId == decision.id);
    let newDecision = JSON.parse(JSON.stringify(decision)) as Decision;

    newDecision.prevId = decision.id;
    newDecision.id = 0;
    newDecision.state = State.STATE_DELETED;
    if (found != -1)
      this.sharedDataService.decisionChangesets[found] = newDecision;
    else
      this.sharedDataService.decisionChangesets.push(newDecision);
    this.navCtrl.parent.select(1);
    this.sharedDataService.decisionEditMode = false;
  }

  refreshDecisions () {
    this.decisions = this.decisionService.getDecisions(this.groupId)
      .map((decisions: Decision[]) =>
      this.sharedDataService.decisionListTimelineMode ? this.sortByDate(decisions) : this.sortByDate(this.filterPastDecisions(decisions)));
  }

  onFAB (fab: FabContainer) {
    fab.close();
    this.refreshDecisions();
  }
}
