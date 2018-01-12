import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, RoleService, DecisionService, SharedDataService } from '../../../providers';
import { DecisionListElement, RoleEditorElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'role-editor'
})
@Component({
  selector: 'page-role-editor',
  templateUrl: 'role-editor.html',
})
export class RoleEditorPage {

  groupId: number;
  decisions: Observable<DecisionListElement[]>;

  permissions: any;
  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public roleService: RoleService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    this.permissions = ['CREATE', 'READ', 'INTERACTION', 'DELETE'];

    this.form = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(32), Validators.required])],
      home: [[]],
      member: [[]],
      role: [[]],
      proceeding: [[]],
      decision: [[]],
      activity: [[]],
      receipt: [[]],
      parentDecision: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_ROLE']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_ROLE + ' - ' + values.I18N_EDITOR;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.decisions = this.decisionService.getDecisions(this.groupId).map(decisions => decisions.filter(decision => (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' ) && decision.next_id == 0));
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('RoleListPage');
    else
      this.navCtrl.pop();
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid) return;
    this.form.value.name = this.form.value.name.trim();

    let newRole = new RoleEditorElement(0, this.form.value.name,
      this.form.value.home,
      this.form.value.member,
      this.form.value.role,
      this.form.value.proceeding,
      this.form.value.decision,
      this.form.value.activity,
      this.form.value.receipt,
      this.form.value.parentDecision);

    this.roleService.create(this.groupId, newRole).toPromise()
      .then(() => this.navCtrl.setRoot('RoleListPage'))
      .catch(() => { console.log('new role failed') });
  }
}
