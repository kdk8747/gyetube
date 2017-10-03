import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
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
    public event: Events,
    public activityService: ActivityService) {
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();
    this.activities = this.activityService.getActivities(this.groupId)
      .map((activities: Activity[]) => this.sortByDateA(activities));
    this.event.subscribe('EventActivityDetailPage', (obj) => {
      let top:ViewController = this.navCtrl.last();
      if (top.id !== 'ActivityDetailPage' || top.data.id !== obj.id)
        this.navCtrl.push('ActivityDetailPage', { id: obj.id });
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('EventActivityDetailPage');
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
