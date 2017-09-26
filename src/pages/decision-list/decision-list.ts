import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, DecisionService } from '../../providers';
import { Decision } from '../../models';
import { State } from '../../app/constants';


@IonicPage({
  segment: 'decision'
})
@Component({
  selector: 'page-decision-list',
  templateUrl: 'decision-list.html',
})
export class DecisionListPage {

  groupId: string;
  decisions: Decision[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public decisionService: DecisionService) {
  }

  ionViewDidLoad() {
    if (!this.util.isNativeApp()) {
      let splits = window.location.href.split('/');
      if (splits.length > 5) {
        console.log(splits[4]);
        this.groupId = splits[4];

        this.decisionService.getDecisions(this.groupId)
          .then(decisions => { this.decisions = decisions; this.filterPastDecisions(); });
      }
      else {
        console.log('there is no group');
      }
    }
    else {
      this.groupId = this.util.getCurrentGroupId();
      this.decisionService.getDecisions(this.groupId)
        .then(decisions => { this.decisions = decisions; this.filterPastDecisions(); });
    }
  }

  filterPastDecisions(): void {
    let decisionIdToIndex = {};
    for (let i = 0; i < this.decisions.length; i++)
      decisionIdToIndex[this.decisions[i].id] = i;

    let visitedIndex = new Array<boolean>(this.decisions.length).fill(false);
    for (let i = 0; i < this.decisions.length; i++) {
      if (this.decisions[i].prevId)
        visitedIndex[decisionIdToIndex[this.decisions[i].prevId]] = true;
      if (this.decisions[i].state == State.STATE_DELETED)
        visitedIndex[decisionIdToIndex[this.decisions[i].id]] = true;
    }

    this.decisions = this.decisions.filter(decision => !visitedIndex[decisionIdToIndex[decision.id]]);
  }

}
