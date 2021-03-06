import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, MemberService, GroupService, ProceedingService, DecisionService, SharedDataService } from '../../../providers';
import { MemberListElement, ProceedingDetailElement, ProceedingEditorElement, DecisionEditorElement, DecisionNewElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';

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
  members: MemberListElement[] = [];

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
      description: ['', Validators.compose([Validators.maxLength(4096), Validators.required])],
      attendees: [[], Validators.compose([Validators.minLength(2), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');

    this.event.subscribe('MemberList_Refresh', () => {
      this.members = this.sharedDataService.members.filter(member =>
        (member.member_state == 'ADDED' || member.member_state == 'UPDATED' || member.member_state == 'JOIN_APPROVED'));
    });

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.members = this.sharedDataService.members.filter(member =>
        (member.member_state == 'ADDED' || member.member_state == 'UPDATED' || member.member_state == 'JOIN_APPROVED'));

      if (this.id) {
        this.proceedingService.getProceeding(this.groupId, this.id)
          .subscribe((proceeding: ProceedingDetailElement) => {
            this.form.controls['meetingDate'].setValue(this.util.toIsoStringWithTimezoneOffset(new Date(proceeding.meeting_datetime)));
            this.form.controls['title'].setValue(proceeding.title);
            this.form.controls['description'].setValue(proceeding.description);
            this.form.controls['attendees'].setValue(proceeding.attendees);
            this.sharedDataService.proceedingAttendees = proceeding.attendees;

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

  ionViewWillUnload() {
    this.event.unsubscribe('MemberList_Refresh');
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
    this.sharedDataService.decisionEditMode = true;
    this.navCtrl.parent.select(2);
    this.navCtrl.parent._tabs[2].setRoot('DecisionListPage');
  }

  onClose(i: number): void {
    this.sharedDataService.decisionChangesets.splice(i, 1);
  }

  isThisPartOfAttendees(memberId: string): boolean {
    return this.form.value.attendees.some(attendee => attendee.member_id == memberId);
  }

  isValidVote(): boolean {
    return this.sharedDataService.decisionChangesets.every(decision => {
      return decision.accepters.every(accepter => this.sharedDataService.proceedingAttendees.some(attendee => attendee.member_id == accepter.member_id))
        && decision.rejecters.every(rejecter => this.sharedDataService.proceedingAttendees.some(attendee => attendee.member_id == rejecter.member_id))
        && decision.abstainers.every(abstainer => this.sharedDataService.proceedingAttendees.some(attendee => attendee.member_id == abstainer.member_id));
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

    let newProceeding = new ProceedingEditorElement(this.id ? this.id : 0,
      this.form.value.meetingDate, this.form.value.title, this.form.value.description,
      this.form.value.attendees.map(attendee => attendee.member_id),
      childDecisions);

    this.proceedingService.create(this.groupId, newProceeding).subscribe((proceeding) => this.finalize(proceeding));
  }

  finalize(proceeding) {
    if (this.id)
      this.sharedDataService.proceedings = this.sharedDataService.proceedings.filter(proceeding => proceeding.proceeding_id != this.id);
    this.sharedDataService.proceedings.push(proceeding);

    this.sharedDataService.decisionEditMode = false;
    this.sharedDataService.decisionChangesets = [];
    this.decisionService.getDecisions(this.groupId).subscribe(
      decisions => { this.sharedDataService.decisions = decisions; this.event.publish('DecisionList_Refresh'); },
      err => { this.sharedDataService.decisions = []; this.event.publish('DecisionList_Refresh'); }
    );
    this.event.publish('ProceedingList_Refresh');
    this.popNavigation();
  }
}
