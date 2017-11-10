import { Injectable } from '@angular/core';

import { Decision } from '../models';


@Injectable()
export class DecisionChangesetService {
    decisions: Decision[] = [];
}
