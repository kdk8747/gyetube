import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ProceedingService, SharedDataService } from '../../../providers';
import { ProceedingDetailElement, MemberListElement } from '../../../models';


@IonicPage({
  segment: 'proceeding-detail/:id'
  //defaultHistory: ['ProceedingListPage'] https://github.com/ionic-team/ionic/issues/10356
})
@Component({
  selector: 'page-proceeding-detail',
  templateUrl: 'proceeding-detail.html',
})
export class ProceedingDetailPage {
  verifiedGood: boolean = true;

  groupId: number;
  id: number;
  proceeding: ProceedingDetailElement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
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
      this.proceedingService.getProceeding(this.groupId, this.id).subscribe((proceeding: ProceedingDetailElement) => {
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

  onSubmit() {
    if (this.verifiedGood) {
      this.proceedingService.update(this.groupId, this.proceeding.proceeding_id).subscribe(() => {

        /* Update Local ProceedingDetailElement */
        this.proceeding.reviewed_attendees.push(
          new MemberListElement(
            this.sharedDataService.myselfMemberId,
            this.sharedDataService.myselfMemberLogId, '', '',
            this.sharedDataService.loggedInUser.image_url,
            this.sharedDataService.loggedInUser.name,
            null, 0));
        if (this.proceeding.reviewers.length == this.proceeding.reviewed_attendees.length) {
          this.proceeding.child_decisions.map(decision => decision.document_state = 'ADDED');
          this.proceeding.document_state = 'ADDED';
        }
        this.proceeding.need_my_review = 0;

        /* Update Local List Element */
        let proceedingInList = this.sharedDataService.proceedings.find(proceeding => proceeding.proceeding_id == this.proceeding.proceeding_id);
        proceedingInList.reviewed_attendees_count++;
        if (proceedingInList.reviewers_count == proceedingInList.reviewed_attendees_count) {
          proceedingInList.document_state = 'ADDED';

          this.proceeding.child_decisions.map(child_decision => {
            let decisionInList = this.sharedDataService.decisions.find(decision => decision.decision_id == child_decision.decision_id);
            switch (decisionInList.document_state){
              case 'PENDING_ADDS': decisionInList.document_state = 'ADDED'; break;
              case 'PENDING_UPDATES': decisionInList.document_state = 'UPDATED'; break;
            }
          });
          this.event.publish('DecisionList_Refresh');
        }
        proceedingInList.need_my_review = 0;
        this.event.publish('ProceedingList_Refresh');


        this.event.publish('App_ShowHeader');
        this.event.publish('TabsGroup_ShowTab');
      });
    }
    else {
      this.navCtrl.push('ProceedingEditorPage', { id: this.id });
    }
  }
}
