import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserService, UtilService, GroupService, ProceedingService, DecisionService, ActivityService, ReceiptService } from '../../../providers';
import { User, Group } from '../../../models';
import { Observable } from 'rxjs/Observable';

@IonicPage({
  segment: ':group_id/group-page'
})
@Component({
  selector: 'page-tabs-group',
  templateUrl: 'tabs-group.html',
})
export class TabsGroupPage {
  tab1Root: string = 'GroupHomePage';
  tab2Root: string = 'ProceedingListPage';
  tab3Root: string = 'DecisionListPage';
  tab4Root: string = 'ActivityListPage';
  tab5Root: string = 'ReceiptListPage';

  loggedIn: boolean = false;
  user: User;
  groupId: string = '';
  group: Observable<Group>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public util: UtilService,
    public userService: UserService,
    public groupService: GroupService,
    public proceedingService: ProceedingService,
    public decisionService: DecisionService,
    public activityService: ActivityService,
    public receiptService: ReceiptService
  ) {
  }

  ionViewDidLoad() {
    this.groupId = this.navParams.get('group_id');
    this.group = this.groupService.getGroup(this.groupId);

    this.group.subscribe((group: Group) => {
      this.event.publish('TabsGroupPageLoaded', {title: group.title});
      group.members.map(id => this.userService.cacheUser(id));
      this.proceedingService.cacheProceedings(group.id);
      this.decisionService.cacheDecisions(group.id);
      this.activityService.cacheActivities(group.id);
      this.receiptService.cacheReceipts(group.id);
    });

    this.util.getCurrentUser()
      .then((user: User) => {
        this.loggedIn = true;
        this.user = user;
      }).catch((error: any) => {
        console.log(error);
      });
  }

  pushMenu() {
    if (this.navCtrl.length() == 1)
      this.navCtrl.push('MenuPage');
    else
      this.event.publish('EventMenuPage');
  }

}
