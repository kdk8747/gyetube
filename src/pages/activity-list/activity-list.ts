import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilService, ActivityService } from '../../providers';
import { Activity } from '../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'activity'
})
@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
})
export class ActivityListPage {

  groupId: string;
  activities: Observable<Activity[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public activityService: ActivityService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.activities = this.activityService.getActivities(this.groupId)
      .map((activities: Activity[]) => this.sortByDateA(activities));
  }

  navigateToDetail(activityId: number) {
    this.navCtrl.push('ActivityDetailPage', { id: activityId });
  }

  sortByDateA(activities: Activity[]): Activity[] {
    return activities.sort((h1, h2) => {
      return h1.activityDate < h2.activityDate ? 1 :
        (h1.activityDate > h2.activityDate ? -1 : 0);
    });
  }
}
