import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, MemberService, RoleService, DecisionService, SharedDataService } from '../../../providers';
import { DecisionListElement, RoleListElement, MemberListElement, MemberEditorElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';


@IonicPage({
  segment: 'member-editor'
})
@Component({
  selector: 'page-member-editor',
  templateUrl: 'member-editor.html',
})
export class MemberEditorPage {

  groupId: number;
  id: number;
  decisions: DecisionListElement[] = [];
  roles: RoleListElement[] = [];

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
    this.id = this.navParams.get('id');

    this.event.subscribe('RoleList_Refresh', () => {
      this.roles = this.sharedDataService.roles;
    });
    this.event.subscribe('DecisionList_Refresh', () => {
      this.decisions = this.sharedDataService.decisions.filter(decision =>
        (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED') && decision.next_id == 0);
    });

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.roles = this.sharedDataService.roles;
      this.decisions = this.sharedDataService.decisions.filter(decision =>
        (decision.document_state == 'ADDED' || decision.document_state == 'UPDATED' || decision.document_state == 'PREDEFINED') && decision.next_id == 0);

      if (this.id) {
        this.memberService.getMember(this.groupId, this.id)
          .subscribe((member: MemberListElement) => {
            this.form.controls['name'].setValue(member.name);
            this.form.controls['roles'].setValue(member.role_ids);
            this.form.controls['parentDecision'].setValue(member.parent_decision_id);
          });
      }
    });
  }

  ionViewWillUnload() {
    this.event.unsubscribe('DecisionList_Refresh');
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_MEMBER']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_MEMBER + ' - ' + values.I18N_EDITOR;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');
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

    let newMember = new MemberEditorElement(this.id ? this.id : 0, this.form.value.name, this.form.value.parentDecision, this.form.value.roles);

    if (this.id) {
      this.memberService.update(this.groupId, newMember).toPromise()
        .then((member) => {
          member.roles = newMember.role_ids.map(role_id => this.roles.find(role => role.role_id == role_id).name);
          let i = this.sharedDataService.members.findIndex(list_member => list_member.member_id == member.member_id);
          this.sharedDataService.members[i] = member;
          this.event.publish('MemberList_Refresh');
          this.popNavigation();
        })
        .catch(() => { console.log('update member failed') });
    }
    else {
      this.memberService.create(this.groupId, newMember).toPromise()
        .then((member) => {
          member.roles = newMember.role_ids.map(role_id => this.roles.find(role => role.role_id == role_id).name);
          this.sharedDataService.members.push(member);
          this.event.publish('MemberList_Refresh');
          this.popNavigation();
        })
        .catch(() => { console.log('new member failed') });
    }
  }
}
