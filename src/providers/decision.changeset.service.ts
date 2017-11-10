import { Injectable } from '@angular/core';

import { Decision } from '../models';


@Injectable()
export class DecisionChangesetService {
    isActivated: boolean = false;
    decisions: Decision[] = [];
}
