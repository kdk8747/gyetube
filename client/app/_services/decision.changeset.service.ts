import { Injectable } from '@angular/core';

import { Decision } from '../_models';


@Injectable()
export class DecisionChangesetService {
    isActivated: boolean = false;
    decisions: Decision[] = [];
}