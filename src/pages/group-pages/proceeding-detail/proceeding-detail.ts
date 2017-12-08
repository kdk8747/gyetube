import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, ProceedingService, SharedDataService } from '../../../providers';
import { ProceedingDetailElement, MemberDetailElement } from '../../../models';
import { DocumentState } from '../../../app/constants';
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
  stateEnum = DocumentState;
  verifiedGood: boolean = true;

  groupId: number;
  member: MemberDetailElement;
  id: number;
  proceeding: ProceedingDetailElement = null;
  proceedingObs: Observable<ProceedingDetailElement>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public proceedingService: ProceedingService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.util.getCurrentMember(this.groupId)
        .then((member) => this.member = member)
        .catch((err) => console.log(err));
      this.proceedingObs = this.proceedingService.getProceeding(this.groupId, this.id);
      this.proceedingObs.subscribe((proceeding: ProceedingDetailElement) => {
        this.proceeding = proceeding;
        this.sharedDataService.headerDetailTitle = proceeding.title;
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ProceedingListPage');
    else
      this.navCtrl.pop();
  }

  navigateToPrev() {
    this.navCtrl.setRoot('ProceedingDetailPage', { id: this.proceeding.prev_id });
  }

  navigateToNext() {
    this.navCtrl.setRoot('ProceedingDetailPage', { id: this.proceeding.next_id });
  }

  navigateToDecisionDetail(decision_id: number) {
    this.event.publish('TabsGroup_DecisionDetail', { id: decision_id });
  }

  needYou(proceeding: ProceedingDetailElement): boolean {
    return proceeding && this.member && proceeding.document_state == DocumentState.STATE_PENDING_NEWLY_CREATE
      && proceeding.next_id == 0;
      //&& proceeding.attendees.findIndex(attendee => attendee == this.member.member_id) != -1
      //&& proceeding.reviewers.findIndex(attendee => attendee == this.member.id) == -1;
  }

  onSubmit() {
    if (this.verifiedGood) {/*
      this.proceedingService.update(this.groupId, this.proceeding.id)
        .subscribe((proceeding: Proceeding) => {
          this.proceeding = proceeding;
          if (proceeding.reviewers.length == proceeding.attendees.length) {
            this.navCtrl.setRoot('ProceedingListPage');
            proceeding.childDecisions.map((id: number) => {
              this.decisionService.cacheDecision(this.groupId, id).subscribe(decision =>
                this.decisionService.cacheDecision(this.groupId, decision.prevId).publishLast().connect());
            });
          }
          else {
            this.reviewers = proceeding.reviewers.map((id: number) => this.memberService.getMember(this.groupId, id));
            this.event.publish('App_ShowHeader');
            this.event.publish('TabsGroup_ShowTab');
          }
        });*/
    }
    else {
      this.navCtrl.push('ProceedingEditorPage', { id: this.id });
    }
  }
}
