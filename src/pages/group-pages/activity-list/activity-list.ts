import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilService, ActivityService, SharedDataService } from '../../../providers';
import { ActivityListElement } from '../../../models';

@IonicPage({
  segment: 'activity-list'
})
@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
})
export class ActivityListPage {

  activities: ActivityListElement[] = [];

  constructor(
    public navCtrl: NavController,
    public util: UtilService,
    public event: Events,
    public activityService: ActivityService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.refreshActivities();

    this.event.subscribe('ActivityList_Refresh', () => {
      this.refreshActivities();
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('ActivityList_Refresh');
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(activity_id: number) {
    this.navCtrl.push('ActivityDetailPage', { id: activity_id });
  }

  navigateToEditor() {
    this.navCtrl.push('ActivityEditorPage');
  }

  refreshActivities() {
    this.activities = this.sortByDateA(this.sharedDataService.activities);
  }

  sortByDateA(activities: ActivityListElement[]): ActivityListElement[] {
    return activities.sort((h1, h2) => {
      return h1.activity_datetime < h2.activity_datetime ? 1 :
        (h1.activity_datetime > h2.activity_datetime ? -1 : 0);
    });
  }
}
