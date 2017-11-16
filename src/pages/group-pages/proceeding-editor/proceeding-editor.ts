import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, UserService, GroupService, ProceedingService, DecisionService, SharedDataService } from '../../../providers';
import { User, Group, ProceedingCreation, Proceeding } from '../../../models';
import { State } from '../../../app/constants';

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
    public sharedDataService: SharedDataService
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

    this.groupService.getGroup(this.groupId)
      .subscribe((group: Group) => {
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
          this.sharedDataService.decisionChangesets = [];
          proceeding.childDecisions.map(id =>
            this.decisionService.getDecision(this.groupId, id)
              .subscribe(decision => this.sharedDataService.decisionChangesets.push(decision)));
        });
    }
  }

  ionViewDidEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
  }

  popNavigation() {
    this.sharedDataService.decisionEditMode = false;
    this.sharedDataService.decisionChangesets = [];
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('ProceedingListPage');
    else
      this.navCtrl.pop();
  }

  navigateToUserDetail() {
    ;
  }

  onAddDecisions(): void {
    this.sharedDataService.decisionListTimelineMode = true;
    this.sharedDataService.decisionEditMode = true;
    this.navCtrl.parent.select(2);
    this.navCtrl.parent._tabs[2].setRoot('DecisionListPage');
  }

  onClose(decisionId: number): void {
    this.sharedDataService.decisionChangesets =
      this.sharedDataService.decisionChangesets.filter(item => item.id != decisionId);
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let childDecisions = this.sharedDataService.decisionChangesets.map(decision => {
      decision.meetingDate = this.form.value.meetingDate;
      decision.childActivities = [];
      decision.childReceipts = [];
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
          this.decisionService.cacheDecision(this.groupId, proceeding.childDecisions[i]);
        this.sharedDataService.decisionEditMode = false;
        this.sharedDataService.decisionChangesets = [];
        this.event.publish('DecisionList_Refresh');
        this.navCtrl.setRoot('ProceedingListPage');
      });
  }

}
