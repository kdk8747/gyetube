import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, ProceedingService, SharedDataService } from '../../../providers';
import { Member, Proceeding } from '../../../models';
import { State } from '../../../app/constants';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'proceeding-list'
})
@Component({
  selector: 'page-proceeding-list',
  templateUrl: 'proceeding-list.html',
})
export class ProceedingListPage {
  stateEnum = State;

  member: Member;
  proceedings: Observable<Proceeding[]>;
  creationPermitted: boolean = false;

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
    this.util.getCurrentGroupId().then(group_id => {
      this.util.getCurrentMember(group_id)
        .then((member) => this.member = member)
        .catch((err) => console.log(err));

      this.util.isPermitted('create', 'proceedings', group_id)
        .then(bool => this.creationPermitted = bool)
        .catch((error: any) => {
          console.log(error);
        });;
      this.proceedings = this.proceedingService.getProceedings(group_id)
        .map((proceedings: Proceeding[]) => this.sortByDate(this.filterDeletedProceedings(proceedings)));
    });
  }

  ionViewWillEnter() {
    this.sharedDataService.headerDetailTitle = null;
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  navigateToDetail(proceedingId: number) {
    this.navCtrl.push('ProceedingDetailPage', { id: proceedingId });
  }

  navigateToEditor() {
    this.navCtrl.push('ProceedingEditorPage');
  }

  sortByDate(proceedings: Proceeding[]): Proceeding[] {
    return proceedings.sort((h1, h2) => {
      return h1.meetingDate < h2.meetingDate ? 1 :
        (h1.meetingDate > h2.meetingDate ? -1 : 0);
    });
  }

  filterDeletedProceedings(proceedings: Proceeding[]): Proceeding[] {
    return proceedings.filter(proceeding => proceeding.nextId == 0);
  }

  needYou(proceeding: Proceeding): boolean {
    return proceeding && this.member && proceeding.state == this.stateEnum.STATE_PENDING_CREATE
      && proceeding.nextId == 0
      && proceeding.attendees.findIndex(attendee => attendee == this.member.id) != -1
      && proceeding.reviewers.findIndex(attendee => attendee == this.member.id) == -1;
  }
}
