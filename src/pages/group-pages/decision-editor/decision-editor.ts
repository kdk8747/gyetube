import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, UserService, GroupService, DecisionService, DecisionChangesetService } from '../../../providers';
import { User, Group, Decision } from '../../../models';
import { State } from '../../../app/constants';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'decision-editor'
})
@Component({
  selector: 'page-decision-editor',
  templateUrl: 'decision-editor.html',
})
export class DecisionEditorPage {

  groupId: string;
  id: number;
  responseTimeMs: number = 500;
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
    public decisionService: DecisionService,
    public decisionChangesetService: DecisionChangesetService
  ) {
    this.form = formBuilder.group({
      expiryDate: [this.util.toIsoStringWithTimezoneOffset(new Date()), Validators.required],
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(1024), Validators.required])],
      accepters: [[]],
      rejecters: [[]],
      abstainers: [[]]
    });
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.groupId = this.util.getCurrentGroupId();
    this.responseTimeMs = this.userService.getResponseTimeMs();

    this.groupService.getGroup(this.groupId)
      .subscribe((group: Group) => {
        this.users = group.members.map(id => this.userService.getUser(id));
      });

    if (this.id) {
      this.decisionService.getDecision(this.groupId, this.id)
        .subscribe((decision: Decision) => {
          this.form.controls['expiryDate'].setValue(this.util.toIsoStringWithTimezoneOffset(new Date(decision.expiryDate)));
          this.form.controls['title'].setValue(decision.title);
          this.form.controls['description'].setValue(decision.description);
          this.form.controls['accepters'].setValue(decision.accepters);
          this.form.controls['rejecters'].setValue(decision.rejecters);
          this.form.controls['abstainers'].setValue(decision.abstainers);
        });
    }
    this.event.publish('ShowHeader');
  }

  isValidVoters(): boolean {
    let users = [];
    users = users.concat(this.form.value.accepters);
    users = users.concat(this.form.value.rejecters);
    users = users.concat(this.form.value.abstainers);
    users = users.sort();
    let valid = true;
    for (let i = 1; i < users.length; i++)
      valid = valid && (users[i - 1] != users[i]);

    return valid;
  }

  isValidAccepters(): boolean {
    return !this.form.value.accepters.some((a_id: string) =>
      this.form.value.rejecters.some(id => a_id == id) || this.form.value.abstainers.some(id => a_id == id));
  }

  isValidRejecters(): boolean {
    return !this.form.value.rejecters.some((a_id: string) =>
      this.form.value.accepters.some(id => a_id == id) || this.form.value.abstainers.some(id => a_id == id));
  }

  isValidAbstainers(): boolean {
    return !this.form.value.abstainers.some((a_id: string) =>
      this.form.value.rejecters.some(id => a_id == id) || this.form.value.accepters.some(id => a_id == id));
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('DecisionListPage');
    else
      this.navCtrl.pop();
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid || !this.isValidVoters()) return;
    this.form.value.title = this.form.value.title.trim();
    this.form.value.description = this.form.value.description.trim();

    let newDecision = new Decision(0, 0, State.STATE_NEW_ONE,
      new Date(Date.now()).toISOString(),
      this.form.value.expiryDate,
      this.form.value.abstainers,
      this.form.value.accepters,
      this.form.value.rejecters,
      this.form.value.title, this.form.value.description, 0, [], [], 0, 0);

    if (this.id) {
      newDecision.prevId = this.id;
      newDecision.state = State.STATE_UPDATED;
      let found = this.decisionChangesetService.decisions.findIndex(item => item.prevId == this.id);
      if (found != -1)
        this.decisionChangesetService.decisions[found] = newDecision;
      else
        this.decisionChangesetService.decisions.push(newDecision);
    }
    else
      this.decisionChangesetService.decisions.push(newDecision);

    this.navCtrl.parent.select(1);
    this.decisionChangesetService.isActivated = false;
    this.popNavigation();
  }

}
