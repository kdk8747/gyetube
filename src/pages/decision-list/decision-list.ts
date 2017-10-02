import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, DecisionService } from '../../providers';
import { Decision } from '../../models';
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
    this.decisions = this.decisionService.getDecisions(this.groupId);
  }

  navigateToDetail(decisionId: number) {
    this.navCtrl.push('DecisionDetailPage', { id: decisionId });
  }

}
