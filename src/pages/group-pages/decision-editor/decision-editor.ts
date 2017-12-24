import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService, MemberService, GroupService, DecisionService, SharedDataService } from '../../../providers';
import { MemberDetailElement, MemberListElement, DecisionDetailElement, DecisionEditorElement } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: 'decision-editor'
})
@Component({
  selector: 'page-decision-editor',
  templateUrl: 'decision-editor.html',
})
export class DecisionEditorPage {

  groupId: number;
  id: number;
  members: Observable<MemberDetailElement>[];

  form: FormGroup;
  submitAttempt: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public groupService: GroupService,
    public decisionService: DecisionService,
    public sharedDataService: SharedDataService,
    public translate: TranslateService
  ) {
    let now = new Date();
    let curYear = now.getFullYear();
    let curMonth = now.getMonth();
    let curDate = now.getDate();
    this.form = formBuilder.group({
      expiryDate: [this.util.toIsoStringWithTimezoneOffset(new Date(curYear + 1, curMonth, curDate)), Validators.required],
      title: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(1024), Validators.required])],
      accepters: [[]],
      rejecters: [[]],
      abstainers: [[]]
    });
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.translate.get(['I18N_EDITOR', 'I18N_DECISION', 'I18N_DELETE']).subscribe(values => {
      this.sharedDataService.headerDetailTitle = values.I18N_EDITOR + ' - ' + values.I18N_DECISION;
    });
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');


    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.members = this.sharedDataService.proceedingAttendees.map(id => this.memberService.getMember(this.groupId, id));

      if (this.id) {
        this.decisionService.getDecision(this.groupId, this.id)
          .subscribe((decision: DecisionDetailElement) => {
            this.form.controls['expiryDate'].setValue(this.util.toIsoStringWithTimezoneOffset(new Date(decision.expiry_datetime)));
            this.form.controls['title'].setValue(decision.title);
            this.form.controls['description'].setValue(decision.description);

            this.form.controls['accepters'].setValue(decision.accepters
              .filter(accepter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == accepter.member_id)));

            this.form.controls['rejecters'].setValue(decision.rejecters
              .filter(rejecter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == rejecter.member_id)));

            this.form.controls['abstainers'].setValue(decision.abstainers
              .filter(abstainer => this.sharedDataService.proceedingAttendees.some(attendee => attendee == abstainer.member_id)));
          });
      }
    });
  }

  isValidVoters(): boolean {
    return this.isUniqueVoters() && this.isPartOfAttendees() && this.allAttendeesVoted();
  }

  isUniqueVoters(): boolean {
    let members = [];
    members = members.concat(this.form.value.accepters.map(member => member.member_id));
    members = members.concat(this.form.value.rejecters.map(member => member.member_id));
    members = members.concat(this.form.value.abstainers.map(member => member.member_id));
    members = members.sort();
    let valid = true;
    for (let i = 1; i < members.length; i++)
      valid = valid && (members[i - 1] != members[i]);

    return valid;
  }

  isPartOfAttendees(): boolean {
    return this.form.value.accepters.every(accepter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == accepter.member_id))
      && this.form.value.rejecters.every(rejecter => this.sharedDataService.proceedingAttendees.some(attendee => attendee == rejecter.member_id))
      && this.form.value.abstainers.every(abstainer => this.sharedDataService.proceedingAttendees.some(attendee => attendee == abstainer.member_id));
  }

  allAttendeesVoted(): boolean {
    return this.form.value.accepters.length + this.form.value.rejecters.length + this.form.value.abstainers.length == this.sharedDataService.proceedingAttendees.length;
  }

  isValidAccepters(): boolean {
    return !this.form.value.accepters.some((accepter: MemberListElement) =>
      this.form.value.rejecters.some(rejecter => accepter.member_id == rejecter.member_id)
      || this.form.value.abstainers.some(abstainer => accepter.member_id == abstainer.member_id));
  }

  isValidRejecters(): boolean {
    return !this.form.value.rejecters.some((rejecter: MemberListElement) =>
      this.form.value.accepters.some(accepter => rejecter.member_id == accepter.member_id)
      || this.form.value.abstainers.some(abstainer => rejecter.member_id == abstainer.member_id));
  }

  isValidAbstainers(): boolean {
    return !this.form.value.abstainers.some((abstainer: MemberListElement) =>
      this.form.value.rejecters.some(rejecter => abstainer.member_id == rejecter.member_id)
      || this.form.value.accepters.some(accepter => abstainer.member_id == accepter.member_id));
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

    let newDecision = new DecisionEditorElement(0,
      this.form.value.expiryDate, this.form.value.title, this.form.value.description,
      this.form.value.abstainers,
      this.form.value.accepters,
      this.form.value.rejecters);

    if (this.id) {
      newDecision.prev_id = this.id;
      let found = this.sharedDataService.decisionChangesets.findIndex(item => item.prev_id == this.id);
      if (found != -1)
        this.sharedDataService.decisionChangesets[found] = newDecision;
      else
        this.sharedDataService.decisionChangesets.push(newDecision);
    }
    else
      this.sharedDataService.decisionChangesets.push(newDecision);

    this.navCtrl.parent.select(1);
    this.sharedDataService.decisionEditMode = false;
    this.popNavigation();
  }
}
