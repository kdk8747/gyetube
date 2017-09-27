import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, DecisionService } from '../../providers';
import { Decision } from '../../models';
import { State } from '../../app/constants';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'decision'
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
    public util: UtilService,
    public decisionService: DecisionService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.decisions = this.decisionService.getDecisions(this.groupId)
      .map((decisions: Decision[]) => this.filterPastDecisions(decisions));
  }

  navigateToDetail(decisionId: number) {
    this.navCtrl.push('DecisionDetailPage', { id: decisionId });
  }

  filterPastDecisions(decisions: Decision[]): Decision[] {
    let decisionIdToIndex = {};
    for (let i = 0; i < decisions.length; i++)
      decisionIdToIndex[decisions[i].id] = i;

    let visitedIndex = new Array<boolean>(decisions.length).fill(false);
    for (let i = 0; i < decisions.length; i++) {
      if (decisions[i].prevId)
        visitedIndex[decisionIdToIndex[decisions[i].prevId]] = true;
      if (decisions[i].state == State.STATE_DELETED)
        visitedIndex[decisionIdToIndex[decisions[i].id]] = true;
    }

    return decisions.filter(decision => !visitedIndex[decisionIdToIndex[decision.id]]);
  }

}
