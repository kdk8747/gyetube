import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ActivityService, SharedDataService } from '../../../providers';
import { ActivityDetailElement } from '../../../models';

import 'rxjs/add/operator/toPromise';


@IonicPage({
  segment: 'activity-detail/:id'
  //defaultHistory: ['ActivityListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  groupId: number;
  id: number;
  activity: ActivityDetailElement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public activityService: ActivityService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.activityService.getActivity(this.groupId, this.id).subscribe((activity: ActivityDetailElement) => {
        this.activity = activity;
        this.sharedDataService.headerDetailTitle = activity.title;
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ActivityListPage');
    else
      this.navCtrl.pop();
  }

  navigateToDecisionDetail(decision_id: number) {
    this.event.publish('TabsGroup_DecisionDetail', { id: decision_id });
  }

  navigateToReceiptDetail(receipt_id: number) {
    this.event.publish('TabsGroup_ReceiptDetail', { id: receipt_id });
  }
}
