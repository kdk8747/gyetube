import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ActivityService } from '../../providers';
import { Activity } from '../../models';

@IonicPage({
  segment: 'activity'
})
@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
})
export class ActivityListPage {

  groupId: string;
  activities: Activity[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public activityService: ActivityService) {
  }

  ionViewDidLoad() {
    console.log(window.location.href);
    if (!this.util.isNativeApp()) {
      let splits = window.location.href.split('/');
      if (splits.length > 5) {
        console.log(splits[4]);
        this.groupId = splits[4];

        this.activityService.getActivities(this.groupId)
          .then(activities => { this.activities = activities; this.sortByDateA(); });
      }
      else {
        console.log('there is no group');
      }
    }
    else {
      this.groupId = this.util.getCurrentGroupId();
      this.activityService.getActivities(this.groupId)
        .then(activities => { this.activities = activities; this.sortByDateA(); });
    }
  }

  sortByDateA(): void {
    this.activities = this.activities.sort((h1, h2) => {
      return h1.activityDate < h2.activityDate ? 1 :
        (h1.activityDate > h2.activityDate ? -1 : 0);
    });
  }
}
