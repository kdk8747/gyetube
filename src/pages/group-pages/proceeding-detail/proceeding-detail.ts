import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, UserService, ProceedingService, DecisionService } from '../../../providers';
import { Proceeding, User, Decision } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'detail/:id'
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

    this.proceeding = this.proceedingService.getProceeding(this.groupId, this.id);
    this.proceeding.subscribe((proceeding: Proceeding) => {
      this.attendees = proceeding.attendees.map((id: string) => this.userService.getUser(id));
      if (this.attendees.length > 0)
        this.attendees[0].subscribe(() => this.responseTimeMs = this.userService.getResponseTimeMs());
      this.decisions = proceeding.childDecisions.map((id: number) => this.decisionService.getDecision(this.groupId, id));
    });
  }

  popNavigation() {
    this.navCtrl.setRoot('ProceedingListPage');
  }

  navigateToUserDetail() {
    ;
  }

  navigateToDecisionDetail(obs: Observable<Decision>) {
    obs.subscribe(decision => {
      this.navCtrl.parent.select(2);
      setTimeout(() => this.event.publish('EventDecisionDetailPage', { id: decision.id }), this.responseTimeMs); // delay : work-around
    });
  }
}
