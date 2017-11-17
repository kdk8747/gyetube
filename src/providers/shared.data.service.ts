import { Injectable } from '@angular/core';

import { Decision, User } from '../models';


@Injectable()
export class SharedDataService {
  loggedIn: boolean = false;
  loggedInUser: User = null;

  decisionListTimelineMode: boolean = false;
  decisionEditMode: boolean = false;
  decisionChangesets: Decision[] = [];

  headerGroupTitle: string = null;
  headerDetailTitle: string = null;
}
