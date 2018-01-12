import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, ActivityService, SharedDataService } from '../../../providers';
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
  memberState: string;
  activities: Observable<ActivityListElement[]>;
  createPermitted: boolean = false;
  readPermitted: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilService,
    public event: Events,
    public memberService: MemberService,
    public activityService: ActivityService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    try {
      this.util.getCurrentGroup().then(group => {
        this.groupId = group.group_id;
        this.sharedDataService.headerGroupTitle = group.title;

        this.memberService.getMemberMyself(group.group_id).subscribe(member => {
          this.memberState = member.member_state;
          this.createPermitted = member.role.activity.some(val => val == 'CREATE');
          this.readPermitted = member.role.activity.some(val => val == 'READ');
        }, (err) => {
          this.createPermitted = false;
          this.readPermitted = false;
        });
        this.activities = this.activityService.getActivities(this.groupId)
          .map((activities: ActivityListElement[]) => this.sortByDateA(activities));
      });
    }
    catch (err) {
      console.log(err);
    }
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
