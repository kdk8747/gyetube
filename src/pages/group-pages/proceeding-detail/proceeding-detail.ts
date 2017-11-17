import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, UserService, ProceedingService, DecisionService, SharedDataService } from '../../../providers';
import { Proceeding, User, Decision } from '../../../models';
import { State } from '../../../app/constants';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'proceeding-detail/:id'
  //defaultHistory: ['ProceedingListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-proceeding-detail',
  templateUrl: 'proceeding-detail.html',
})
export class ProceedingDetailPage {
  stateEnum = State;
  verifiedGood: boolean = true;

  groupId: string;
  id: number;
  user: User;
  proceeding: Proceeding = null;
  attendees: Observable<User>[];
  reviewers: Observable<User>[];
  decisions: Observable<Decision>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public decisionService: DecisionService,
    public proceedingService: ProceedingService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();

    this.util.getCurrentUser()
      .then((user) => {
        this.user = user;

        this.proceedingService.getProceeding(this.groupId, this.id)
          .subscribe((proceeding: Proceeding) => {
            this.proceeding = proceeding;
            this.sharedDataService.headerDetailTitle = proceeding.title;
            this.attendees = proceeding.attendees.map((id: string) => this.userService.getUser(id));
            this.reviewers = proceeding.reviewers.map((id: string) => this.userService.getUser(id));
            this.decisions = proceeding.childDecisions.map((id: number) => this.decisionService.getDecision(this.groupId, id));
          });
      }).catch((err) => console.log(err));
  }

  ionViewDidEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToUserDetail() {
    ;
  }

  navigateToPrev() {
    this.navCtrl.setRoot('ProceedingDetailPage', { id: this.proceeding.prevId });
  }

  navigateToNext() {
    this.navCtrl.setRoot('ProceedingDetailPage', { id: this.proceeding.nextId });
  }

  navigateToDecisionDetail(obs: Observable<Decision>) {
    obs.subscribe(decision => {
      this.event.publish('TabsGroup_DecisionDetail', { id: decision.id });
    });
  }

  needYou(proceeding: Proceeding): boolean {
    return proceeding && this.user && proceeding.state == State.STATE_PENDING_CREATE
      && proceeding.nextId == 0
      && proceeding.attendees.findIndex(attendee => attendee == this.user.id) != -1
      && proceeding.reviewers.findIndex(attendee => attendee == this.user.id) == -1;
  }

  onSubmit() {
    if (this.verifiedGood) {
      this.proceedingService.update(this.groupId, this.proceeding.id)
        .subscribe((proceeding: Proceeding) => {
          this.proceeding = proceeding;
          this.reviewers = proceeding.reviewers.map((id: string) => this.userService.getUser(id));
        });
    }
    else {
      this.navCtrl.push('ProceedingEditorPage', { id: this.id });
    }
  }
}
