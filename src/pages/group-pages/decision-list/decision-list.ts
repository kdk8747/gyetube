import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { UtilService, DecisionService, DecisionChangesetService } from '../../../providers';
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
  timelineMode: boolean = false;

  groupId: string;
  decisions: Observable<Decision[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public decisionService: DecisionService,
    public decisionChangesetService: DecisionChangesetService
  ) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.decisions = this.decisionService.getDecisions(this.groupId);

    this.event.subscribe('EventDecisionDetailPage', (obj) => {
      let top:ViewController = this.navCtrl.last();
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
    if (!this.decisionChangesetService.isActivated)
      this.navCtrl.push('DecisionDetailPage', { id: decisionId });
  }

  navigateToEditor() {
    this.navCtrl.push('DecisionEditorPage');
  }

  navigateToEditorForUpdate(id: number) {
    this.navCtrl.push('DecisionEditorPage', {id: id});
  }

  onDelete(decision: Decision): void {
    let found = this.decisionChangesetService.decisions.findIndex(item => item.prevId == decision.id);
    let newDecision = JSON.parse(JSON.stringify(decision)) as Decision;

    newDecision.prevId = decision.id;
    newDecision.id = 0;
    newDecision.state = State.STATE_DELETED;
    if (found != -1)
      this.decisionChangesetService.decisions[found] = newDecision;
    else
      this.decisionChangesetService.decisions.push(newDecision);
    this.navCtrl.parent.select(1);
    this.decisionChangesetService.isActivated = false;
  }
}
