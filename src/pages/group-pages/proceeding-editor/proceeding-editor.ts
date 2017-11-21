import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, UserService, GroupService, ProceedingService, DecisionService, SharedDataService } from '../../../providers';
import { User, Group, ProceedingCreation, Proceeding } from '../../../models';
import { State } from '../../../app/constants';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  segment: 'proceeding-editor'
})
@Component({
  selector: 'page-proceeding-editor',
  templateUrl: 'proceeding-editor.html',
})
export class ProceedingEditorPage {
  stateEnum = State;

  groupId: string;
  id: number;
  users: User[] = [];

  form: FormGroup;
  addAttempt: boolean = false;
  submitAttempt: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public groupService: GroupService,
    public proceedingService: ProceedingService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      meetingDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      description: ['', Validators.compose([Validators.maxLength(1024), Validators.required])],
      attendees: [[], Validators.compose([Validators.minLength(2), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();
  }

  ionViewDidEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_PROCEEDING']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_EDITOR + ' - ' + values.I18N_PROCEEDING;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.groupService.getGroup(this.groupId)
      .subscribe((group: Group) => {
        this.users = [];
        group.members.map(id => {
          this.userService.getUser(id).subscribe(
            (user) => this.users.push(user),
            (err) => console.log('error: ' + err));
        });
      });

    if (this.id) {
      this.proceedingService.getProceeding(this.groupId, this.id)
        .subscribe((proceeding: Proceeding) => {
          this.form.controls['meetingDate'].setValue(this.util.toIsoStringWithTimezoneOffset(new Date(proceeding.meetingDate)));
          this.form.controls['title'].setValue(proceeding.title);
          this.form.controls['description'].setValue(proceeding.description);
          this.form.controls['attendees'].setValue(proceeding.attendees);
          this.sharedDataService.proceedingAttendees = proceeding.attendees;
          this.sharedDataService.decisionChangesets = [];
          proceeding.childDecisions.map(id =>
            this.decisionService.getDecision(this.groupId, id)
              .subscribe(decision => this.sharedDataService.decisionChangesets.push(decision)));
        });
    }
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

  onAddDecisions(): void {
    this.addAttempt = true;

    if (this.form.value.attendees.length < 2) return;

    this.sharedDataService.proceedingAttendees = this.form.value.attendees;
    this.sharedDataService.decisionListTimelineMode = true;
    this.sharedDataService.decisionEditMode = true;
    this.navCtrl.parent.select(2);
    this.navCtrl.parent._tabs[2].setRoot('DecisionListPage');
  }

  onClose(decisionId: number): void {
    this.sharedDataService.decisionChangesets =
      this.sharedDataService.decisionChangesets.filter(item => item.id != decisionId);
  }

  isThisPartOfAttendees(userId: string): boolean {
    return this.form.value.attendees.some(attendee => attendee == userId);
  }

  isValidVote(): boolean {
    return this.sharedDataService.decisionChangesets.every(decision => {
      return decision.accepters.every(accepter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == accepter))
        && decision.rejecters.every(rejecter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == rejecter))
        && decision.abstainers.every(abstainer => this.sharedDataService.proceedingAttendees.some(attendee => attendee == abstainer));
    });
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid || !this.isValidVote()) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let childDecisions = this.sharedDataService.decisionChangesets.map(decision => {
      decision.meetingDate = this.form.value.meetingDate;
      decision.childActivities = [];
      decision.childReceipts = [];
      decision.totalDifference = 0;
      decision.totalElapsedTime = 0;
      return decision;
    });
    let newProceeding = new ProceedingCreation(0, 0, 0, State.STATE_PENDING_CREATE,
      new Date(Date.now()).toISOString(),
      this.form.value.meetingDate,
      this.form.value.attendees,
      [],
      this.form.value.title, this.form.value.description, childDecisions);

    if (this.id) {
      newProceeding.prevId = this.id;
    }
    this.proceedingService.create(this.groupId, newProceeding)
      .subscribe((proceeding: Proceeding) => {
        for (let i = 0; i < proceeding.childDecisions.length; i++)
          this.decisionService.cacheDecision(this.groupId, proceeding.childDecisions[i]).publishLast().connect();
        if (proceeding.prevId > 0) {
          this.proceedingService.cacheProceeding(this.groupId, proceeding.prevId).publishLast().connect();
        }
        this.sharedDataService.decisionEditMode = false;
        this.sharedDataService.decisionChangesets = [];
        this.event.publish('DecisionList_Refresh');
        this.navCtrl.setRoot('ProceedingListPage');
      });
  }

}
