import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilService, MemberService, RoleService, SharedDataService } from '../../../providers';
import { Member, Role } from '../../../models';
import { State } from '../../../app/constants';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'member-detail/:id'
})
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html',
})
export class MemberDetailPage {

  groupId: number;
  id: number;
  imageUrl: string = '';
  member: Observable<Member>;
  creator: Observable<Member>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public memberService: MemberService,
    public roleService: RoleService,
    public sharedDataService: SharedDataService
  ) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  ionViewWillEnter() {
    this.event.publish('App_ShowHeader');
    this.event.publish('TabsGroup_ShowTab');

    this.util.getCurrentGroupId().then(group_id => {
      this.groupId = group_id;
      this.member = this.memberService.getMember(this.groupId, this.id);
      this.member.subscribe((member: Member) => {
        this.sharedDataService.headerDetailTitle = member.name;
        this.imageUrl = member.imageUrl;
        this.creator = this.memberService.getMember(this.groupId, member.creator);
        //if (member.parentDecision)
          ;//this.decision = this.decisionService.getDecision(this.groupId, member.parentDecision);
      });
    });
  }

  popNavigation() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.setRoot('MemberListPage');
    else
      this.navCtrl.pop();
  }

  navigateToMemberDetail() {
    ;
  }

}
