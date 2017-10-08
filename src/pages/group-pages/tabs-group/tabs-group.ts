import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService, GroupService } from '../../../providers';
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
    public storage: Storage,
    public userService: UserService,
    public groupService: GroupService
  ) {
  }

  ionViewDidLoad() {
    this.groupId = this.navParams.get('group_id');
    this.storage.get('currentUserToken').then((token: string) => {
      if (token) {
        let tokens = token.split('.');
        if (tokens.length === 3) {
          let payload = JSON.parse(window.atob(tokens[1]));
          let userId = payload.id;
          this.userService.getUser(userId).subscribe(
            (user: User) => {
              this.loggedIn = true;
              this.user = user;
            },
            (error: any) => {
              this.storage.clear();
              console.log(error);
            });
        }
      }
    });
    this.group = this.groupService.getGroup(this.groupId);
  }

  pushMenu() {
    this.navCtrl.push('MenuPage');
  }

  popMenu() {
    this.navCtrl.setRoot('TabsMyPage');
  }

}