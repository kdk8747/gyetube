import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ActivityService, SharedDataService } from '../../../providers';
import { Activity } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'activity-list'
})
@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
})
export class ActivityListPage {

  groupId: string;
  activities: Observable<Activity[]>;
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
    this.groupId = this.util.getCurrentGroupId();
    this.util.isPermitted('create', 'activities', this.groupId)
      .then(bool => this.creationPermitted = bool)
      .catch((error: any) => {
        console.log(error);
      });;
    this.activities = this.activityService.getActivities(this.groupId)
      .map((activities: Activity[]) => this.sortByDateA(activities));
  }

  ionViewDidEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(activityId: number) {
    this.navCtrl.push('ActivityDetailPage', { id: activityId });
  }

  navigateToEditor() {
    this.navCtrl.push('ActivityEditorPage');
  }

  sortByDateA(activities: Activity[]): Activity[] {
    return activities.sort((h1, h2) => {
      return h1.activityDate < h2.activityDate ? 1 :
        (h1.activityDate > h2.activityDate ? -1 : 0);
    });
  }
}
