import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, DecisionService, UserService, ProceedingService, ActivityService } from '../../providers';
import { Decision, User, Proceeding, Activity } from '../../models';
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
  abstainers: Observable<User>[];
  accepters: Observable<User>[];
  rejecters: Observable<User>[];
  proceeding: Observable<Proceeding>;
  activities: Observable<Activity>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public decisionService: DecisionService,
    public proceedingService: ProceedingService,
    public activityService: ActivityService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();
    this.decision = this.decisionService.getDecision(this.groupId, this.id).share();
    this.decision.subscribe((decision: Decision) => {
      this.abstainers = decision.abstainers.map((id:string) => this.userService.getUser(id));
      this.accepters = decision.accepters.map((id:string) => this.userService.getUser(id));
      this.rejecters = decision.rejecters.map((id:string) => this.userService.getUser(id));
      this.proceeding = this.proceedingService.getProceeding(this.groupId, decision.parentProceeding);
      this.activities = decision.childActivities.map((id:number) => this.activityService.getActivity(this.groupId, id));
    });
  }

  popMenu() {
    this.navCtrl.setRoot('DecisionListPage'); // work-around
  }

  navigateToUserDetail() {
    ;
  }

  navigateToProceedingDetail(obs: Observable<Proceeding>) {
    obs.subscribe(proceeding => {
      this.navCtrl.parent.select(1);
      setTimeout(() => this.event.publish('EventProceedingDetailPage', {id: proceeding.id }), 300); // 300 ms delay : work-around
    });
  }

  navigateToActivityDetail(obs: Observable<Activity>) {
    obs.subscribe(activity => {
      this.navCtrl.parent.select(3);
      setTimeout(() => this.event.publish('EventActivityDetailPage', {id: activity.id }), 300); // 300 ms delay : work-around
    });
  }
}
