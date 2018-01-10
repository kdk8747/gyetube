import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, ProceedingService, SharedDataService } from '../../../providers';
import { User, ProceedingDetailElement, MemberListElement, MemberDetailElement } from '../../../models';
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
  verifiedGood: boolean = true;

  groupId: number;
  user: User;
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

    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.util.getCurrentUser()
        .then((user) => this.user = user)
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

  onSubmit() {
    if (this.verifiedGood) {
      this.proceedingService.update(this.groupId, this.proceeding.proceeding_id)
        .subscribe(() => {
          this.util.getCurrentUser()
            .then(user => {
              this.proceeding.reviewers.push(new MemberListElement(0,0,0,0,'','','',user.image_url,user.name,null));
              if (this.proceeding.reviewers.length == this.proceeding.attendees.length) {
                this.proceeding.child_decisions.map(decision => decision.document_state = 'ADDED');
                this.proceeding.document_state = 'ADDED';
              }
            });
          this.proceeding.need_my_review = 0;
          this.event.publish('App_ShowHeader');
          this.event.publish('TabsGroup_ShowTab');
        });
    }
    else {
      this.navCtrl.push('ProceedingEditorPage', { id: this.id });
    }
  }
}
