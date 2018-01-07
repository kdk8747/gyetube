import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, MemberService, GroupService, ProceedingService, DecisionService, SharedDataService } from '../../../providers';
import { MemberListElement, ProceedingDetailElement, ProceedingEditorElement, DecisionEditorElement, DecisionNewElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'proceeding-editor'
})
@Component({
  selector: 'page-proceeding-editor',
  templateUrl: 'proceeding-editor.html',
})
export class ProceedingEditorPage {

  groupId: number;
  id: number;
  members: Observable<MemberListElement[]>;

  form: FormGroup;
  addAttempt: boolean = false;
  submitAttempt: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public groupService: GroupService,
    public proceedingService: ProceedingService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      meetingDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(1024), Validators.required])],
      attendees: [[], Validators.compose([Validators.minLength(2), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');

    this.util.pageGetReady().then(group_id => {
      this.groupId = group_id;
      this.members = this.memberService.getMembers(this.groupId).map(members => members.filter(member => member.document_state != 'PENDING_ADDS' && member.next_id == 0));

      if (this.id) {
        this.proceedingService.getProceeding(this.groupId, this.id)
          .subscribe((proceeding: ProceedingDetailElement) => {
            this.form.controls['meetingDate'].setValue(this.util.toIsoStringWithTimezoneOffset(new Date(proceeding.meeting_datetime)));
            this.form.controls['title'].setValue(proceeding.title);
            this.form.controls['description'].setValue(proceeding.description);
            this.form.controls['attendees'].setValue(proceeding.attendees.map(attendee => attendee.member_id));
            this.sharedDataService.proceedingAttendees = proceeding.attendees.map(attendee => attendee.member_id);

            this.sharedDataService.decisionChangesets = [];
            proceeding.child_decisions.map(dle =>
              this.decisionService.getDecision(this.groupId, dle.decision_id)
                .subscribe(ddl => this.sharedDataService.decisionChangesets.push(
                  new DecisionEditorElement(ddl.decision_id, ddl.expiry_datetime, ddl.title, ddl.description, ddl.abstainers, ddl.accepters, ddl.rejecters)
                )
              )
            );
          });
      }
    });
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_PROCEEDING']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_PROCEEDING + ' - ' + values.I18N_EDITOR;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ProceedingListPage');
    else
      this.navCtrl.pop();
  }

  navigateToMemberDetail() {
    ;
  }

  onAddDecisions(): void {
    this.addAttempt = true;

    if (this.form.value.attendees.length < 2) return;

    this.sharedDataService.proceedingAttendees = this.form.value.attendees;
    this.sharedDataService.decisionListTimelineMode = true;
    this.sharedDataService.decisionEditMode = true;
    this.navCtrl.parent.select(2);
    this.navCtrl.parent._tabs[2].setRoot('DecisionListPage');
  }

  onClose(i: number): void {
    this.sharedDataService.decisionChangesets.splice(i, 1);
  }

  isThisPartOfAttendees(memberId: string): boolean {
    return this.form.value.attendees.some(attendee => attendee == memberId);
  }

  isValidVote(): boolean {
    return this.sharedDataService.decisionChangesets.every(decision => {
      return decision.accepters.every(accepter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == accepter.member_id))
        && decision.rejecters.every(rejecter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == rejecter.member_id))
        && decision.abstainers.every(abstainer => this.sharedDataService.proceedingAttendees.some(attendee => attendee == abstainer.member_id));
    });
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid || !this.isValidVote()) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let childDecisions = this.sharedDataService.decisionChangesets.map(dee => new DecisionNewElement(dee.prev_id, dee.expiry_datetime, dee.title, dee.description,
      dee.abstainers.map(member => member.member_id),
      dee.accepters.map(member => member.member_id),
      dee.rejecters.map(member => member.member_id)));
      console.log(childDecisions);

    let newProceeding = new ProceedingEditorElement(this.id ? this.id : 0,
      new Date(Date.now()).toISOString(),
      this.form.value.meetingDate, this.form.value.title, this.form.value.description,
      this.form.value.attendees,
      childDecisions);

    this.proceedingService.create(this.groupId, newProceeding)
      .subscribe(() => {
        this.sharedDataService.decisionEditMode = false;
        this.sharedDataService.decisionChangesets = [];
        this.event.publish('DecisionList_Refresh');
        this.navCtrl.setRoot('ProceedingListPage');
      });
  }
}
