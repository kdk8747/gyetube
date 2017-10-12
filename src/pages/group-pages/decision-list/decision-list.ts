import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { UtilService, DecisionService } from '../../../providers';
import { Decision } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'list'
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
    public decisionService: DecisionService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.decisions = this.decisionService.getDecisions(this.groupId);
    this.event.subscribe('EventDecisionDetailPage', (obj) => {
      let top:ViewController = this.navCtrl.last();
      if (top.id === 'DecisionDetailPage' && top.data.id !== obj.id)
        this.navCtrl.pop();
      if (top.id !== 'DecisionDetailPage' || top.data.id !== obj.id)
        this.navCtrl.push('DecisionDetailPage', { id: obj.id });
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('EventDecisionDetailPage');
  }

  navigateToDetail(decisionId: number) {
    this.navCtrl.push('DecisionDetailPage', { id: decisionId });
  }

}
