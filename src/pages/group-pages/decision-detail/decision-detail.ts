import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, UserService, DecisionService, ProceedingService, ActivityService, ReceiptService } from '../../../providers';
import { Decision, User, Proceeding, Activity, Receipt } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'decision-detail/:id'
  //defaultHistory: ['DecisionListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-decision-detail',
  templateUrl: 'decision-detail.html',
})
export class DecisionDetailPage {

  groupId: string;
  id: number;
  responseTimeMs: number = 500;
  decision: Observable<Decision>;
  abstainers: Observable<User>[] = [];
  accepters: Observable<User>[] = [];
  rejecters: Observable<User>[] = [];
  proceeding: Observable<Proceeding> = null;
  activities: Observable<Activity>[];
  receipts: Observable<Receipt>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public decisionService: DecisionService,
    public proceedingService: ProceedingService,
    public activityService: ActivityService,
    public receiptService: ReceiptService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();

    this.decision = this.decisionService.getDecision(this.groupId, this.id);
    this.decision.subscribe((decision: Decision) => {
      this.abstainers = decision.abstainers.map((id: string) => this.userService.getUser(id));
      this.accepters = decision.accepters.map((id: string) => this.userService.getUser(id));
      this.rejecters = decision.rejecters.map((id: string) => this.userService.getUser(id));
      if (this.accepters.length > 0)
        this.accepters[0].subscribe(() => this.responseTimeMs = this.userService.getResponseTimeMs());
      if (decision.parentProceeding)
        this.proceeding = this.proceedingService.getProceeding(this.groupId, decision.parentProceeding);
      if (decision.childActivities)
        this.activities = decision.childActivities.map((id: number) => this.activityService.getActivity(this.groupId, id));
      if (decision.childReceipts)
        this.receipts = decision.childReceipts.map((id: number) => this.receiptService.getReceipt(this.groupId, id));
    });
    this.event.publish('ShowHeader');
  }

  popNavigation() {
    this.navCtrl.setRoot('DecisionListPage');
  }

  navigateToUserDetail() {
    ;
  }

  navigateToProceedingDetail(obs: Observable<Proceeding>) {
    obs.subscribe(proceeding => {
      this.navCtrl.parent.select(1);
      setTimeout(() => this.event.publish('EventProceedingDetailPage', { id: proceeding.id }), this.responseTimeMs); // delay : work-around
    });
  }

  navigateToActivityDetail(obs: Observable<Activity>) {
    obs.subscribe(activity => {
      this.navCtrl.parent.select(3);
      setTimeout(() => this.event.publish('EventActivityDetailPage', { id: activity.id }), this.responseTimeMs); // delay : work-around
    });
  }

  navigateToReceiptDetail(obs: Observable<Receipt>) {
    obs.subscribe(receipt => {
      this.navCtrl.parent.select(4);
      setTimeout(() => this.event.publish('EventReceiptDetailPage', { id: receipt.id }), this.responseTimeMs); // delay : work-around
    });
  }
}
