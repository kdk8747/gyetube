import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, MemberService, RoleService, DecisionService, SharedDataService } from '../../../providers';
import { DecisionListElement, RoleListElement, MemberEditorElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'member-editor'
})
@Component({
  selector: 'page-member-editor',
  templateUrl: 'member-editor.html',
})
export class MemberEditorPage {

  groupId: number;
  decisions: Observable<DecisionListElement[]>;
  roles: Observable<RoleListElement[]>;

  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public roleService: RoleService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(32), Validators.required])],
      roles: [[], Validators.required],
      parentDecision: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_MEMBER']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_MEMBER + ' - ' + values.I18N_EDITOR;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.roles = this.roleService.getRoles(this.groupId);
      this.decisions = this.decisionService.getDecisions(this.groupId).map(decisions => decisions.filter(decision => (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' ) && decision.next_id == 0));
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('MemberListPage');
    else
      this.navCtrl.pop();
  }

  onSave(): void {
    this.submitAttempt = true;

    if (!this.form.valid) return;
    this.form.value.name = this.form.value.name.trim();

    let newMember = new MemberEditorElement(0, this.form.value.name, this.form.value.parentDecision, this.form.value.roles);

    this.memberService.create(this.groupId, newMember).toPromise()
      .then(() => this.navCtrl.setRoot('MemberListPage'))
      .catch(() => { console.log('new member failed') });
  }
}
