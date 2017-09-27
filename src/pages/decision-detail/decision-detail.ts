import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, DecisionService } from '../../providers';
import { Decision } from '../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'decision/:id'
  //defaultHistory: ['DecisionListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-decision-detail',
  templateUrl: 'decision-detail.html',
})
export class DecisionDetailPage {

    groupId: string;
    id: number;
    decision: Observable<Decision>;

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public util: UtilService,
      public decisionService: DecisionService) {
    }

    ionViewDidLoad() {
      this.id = this.navParams.get('id');
      this.groupId = this.util.getCurrentGroupId();
      this.decision = this.decisionService.getDecision(this.groupId, this.id).share();
    }

    popMenu() {
      this.navCtrl.setRoot('DecisionListPage'); // work-around
    }
}
