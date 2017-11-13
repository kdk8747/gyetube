import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, UserService, GroupService, ProceedingService, DecisionService, SharedDataService } from '../../../providers';
import { User, Group, Proceeding } from '../../../models';
import { State } from '../../../app/constants';
import { Observable } from 'rxjs/Observable';

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
  users: Observable<User>[];

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
      meetingDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(1024), Validators.required])],
      attendees: [[], Validators.compose([Validators.minLength(2), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.groupId = this.util.getCurrentGroupId();

    this.groupService.getGroup(this.groupId)
      .subscribe((group: Group) => {
        this.users = group.members.map(id => this.userService.getUser(id));
      });
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
    this.sharedDataService.decisionEditMode = true;
    this.navCtrl.parent.select(2);
    this.navCtrl.parent._tabs[2].setRoot('DecisionListPage');
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let newProceeding = new Proceeding(0, 0, State.STATE_NEW_ONE,
      new Date(Date.now()).toISOString(),
      this.form.value.meetingDate,
      this.form.value.attendees,
      this.form.value.title, this.form.value.description, []);

    this.proceedingService.create(this.groupId, newProceeding).toPromise()
      .then((proceeding: Proceeding) => {
        return Promise.all(this.sharedDataService.decisionChangesets.map(decision => {
          decision.childActivities = [];
          decision.childReceipts = [];
          decision.parentProceeding = proceeding.id;
          return this.decisionService.create(this.groupId, decision).toPromise();
        }));
      })
      .then(() => {
        this.sharedDataService.decisionEditMode = false;
        this.sharedDataService.decisionChangesets = [];
        this.event.publish('DecisionList_Refresh');
        this.navCtrl.setRoot('ProceedingListPage');
      }).catch(() => { console.log('new proceeding failed') });
  }

}
