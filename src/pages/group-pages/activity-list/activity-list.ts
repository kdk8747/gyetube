import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ActivityService, SharedDataService } from '../../../providers';
import { ActivityListElement } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'activity-list'
})
@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
})
export class ActivityListPage {

  groupId: number;
  activities: Observable<ActivityListElement[]>;
  creationPermitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public event: Events,
    public activityService: ActivityService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.util.isPermitted('create', 'activities', this.groupId)
        .then(bool => this.creationPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });;
      this.activities = this.activityService.getActivities(this.groupId)
        .map((activities: ActivityListElement[]) => this.sortByDateA(activities));
    });
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

  sortByDateA(activities: ActivityListElement[]): ActivityListElement[] {
    return activities.sort((h1, h2) => {
      return h1.activity_datetime < h2.activity_datetime ? 1 :
        (h1.activity_datetime > h2.activity_datetime ? -1 : 0);
    });
  }
}
