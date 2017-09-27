import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ActivityService } from '../../providers';
import { Activity } from '../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'activity/:id'
  //defaultHistory: ['ActivityListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

    groupId: string;
    id: number;
    activity: Observable<Activity>;

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public util: UtilService,
      public activityService: ActivityService) {
    }

    ionViewDidLoad() {
      this.id = this.navParams.get('id');
      this.groupId = this.util.getCurrentGroupId();
      this.activity = this.activityService.getActivity(this.groupId, this.id).share();
    }

    popMenu() {
      this.navCtrl.setRoot('ActivityListPage'); // work-around
    }

}
