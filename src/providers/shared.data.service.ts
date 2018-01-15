import { Injectable } from '@angular/core';

import { DecisionEditorElement, User } from '../models';
import { Group, MemberListElement, RoleListElement, ProceedingListElement, DecisionListElement, ActivityListElement, ReceiptListElement } from '../models';


@Injectable()
export class SharedDataService {
  /* FOR UI */
  paneSplited: boolean = false;

  loggedIn: boolean = false;
  loggedInUser: User = null;

  proceedingAttendees: MemberListElement[] = [];
  decisionListTimelineMode: boolean = false;
  decisionEditMode: boolean = false;
  decisionChangesets: DecisionEditorElement[] = [];

  headerGroupTitle: string = null;
  headerDetailTitle: string = null;

  deletedRoleListMode: boolean = false;

  /* FOR API CACHE */
  group: Group;
  members: MemberListElement[] = [];
  roles: RoleListElement[] = [];
  proceedings: ProceedingListElement[] = [];
  decisions: DecisionListElement[] = [];
  activities: ActivityListElement[] = [];
  receipts: ReceiptListElement[] = [];

  myselfMemberId: number;
  myselfMemberLogId: number;
  myselfState: string;
  memberReadPermitted: boolean = false;
  memberCreatePermitted: boolean = false;
  roleReadPermitted: boolean = false;
  roleCreatePermitted: boolean = false;
  proceedingCreatePermitted: boolean = false;
  proceedingReadPermitted: boolean = true;
  decisionReadPermitted: boolean = true;
  activityCreatePermitted: boolean = false;
  activityReadPermitted: boolean = true;
  receiptCreatePermitted: boolean = false;
  receiptReadPermitted: boolean = true;
  receiptInteractionPermitted: boolean = false;
}
