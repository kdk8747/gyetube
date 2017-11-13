import { Injectable } from '@angular/core';

import { Decision } from '../models';


@Injectable()
export class SharedDataService {
  decisionListTimelineMode: boolean = false;
  decisionEditMode: boolean = false;
  decisionChangesets: Decision[] = [];
}
