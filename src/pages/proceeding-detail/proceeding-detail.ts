import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ProceedingService, DecisionService, UserService } from '../../providers';
import { Proceeding, User, Decision } from '../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'proceeding/:id'
  //defaultHistory: ['ProceedingListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-proceeding-detail',
  templateUrl: 'proceeding-detail.html',
})
export class ProceedingDetailPage {

  groupId: string;
  id: number;
  responseTimeMs: number = 500;
  proceeding: Observable<Proceeding>;
  attendees: Observable<User>[];
  decisions: Observable<Decision>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public decisionService: DecisionService,
    public proceedingService: ProceedingService) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();

    let sendDate = (new Date()).getTime();
    this.proceeding = this.proceedingService.getProceeding(this.groupId, this.id).share();
    this.proceeding.subscribe((proceeding: Proceeding) => {
      let receiveDate = (new Date()).getTime();
      this.responseTimeMs = receiveDate - sendDate;
      this.attendees = proceeding.attendees.map((id:string) => this.userService.getUser(id).share());
      this.decisions = proceeding.childDecisions.map((id:number) => this.decisionService.getDecision(this.groupId,id).share());
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ProceedingListPage');
    else
      this.navCtrl.pop();
  }

  navigateToUserDetail() {
    ;
  }

  navigateToDecisionDetail(obs: Observable<Decision>) {
    obs.subscribe(decision => {
      this.navCtrl.parent.select(2);
      setTimeout(() => this.event.publish('EventDecisionDetailPage', {id: decision.id }), this.responseTimeMs); // delay : work-around
    });
  }
}
